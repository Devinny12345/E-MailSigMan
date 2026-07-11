import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

async function fetchImageAsDataUrl(url: string): Promise<string | null> {
  try {
    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const headers: Record<string, string> = {};
    if (token && url.includes("blob.vercel-storage.com")) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch(url, { headers, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return null;
    const buf = await res.arrayBuffer();
    const ext = res.headers.get("content-type")?.includes("gif") ? "gif" : "png";
    const base64 = Buffer.from(buf).toString("base64");
    return `data:image/${ext};base64,${base64}`;
  } catch {
    return null;
  }
}

async function getFontData(): Promise<ArrayBuffer | null> {
  try {
    const response = await fetch(
      "https://fonts.gstatic.com/s/inter/v18/UcC73FwrK3iLTeHuS_fvQtMwCp50KnMa2JL7SUc.woff2",
      { signal: AbortSignal.timeout(5000) }
    );
    if (!response.ok) return null;
    return response.arrayBuffer();
  } catch {
    return null;
  }
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const sig = await prisma.signature.findUnique({ where: { id } });
    if (!sig) {
      return new Response("Not found", { status: 404 });
    }

    const [fontData, logoDataUrl, avatarDataUrl] = await Promise.all([
      getFontData(),
      sig.companyLogoUrl ? fetchImageAsDataUrl(sig.companyLogoUrl) : null,
      sig.avatarUrl ? fetchImageAsDataUrl(sig.avatarUrl) : null,
    ]);

    return new ImageResponse(
      (
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            width: 600,
            backgroundColor: "#0d3b66",
            fontFamily: "Inter",
            padding: "20px 24px 20px 24px",
          }}
        >
          <div style={{ display: "flex", flexDirection: "row" }}>
            {logoDataUrl && (
              <div
                style={{
                  width: 150,
                  marginRight: 15,
                  display: "flex",
                  alignItems: "flex-start",
                  flexShrink: 0,
                }}
              >
                <img
                  src={logoDataUrl}
                  width={130}
                  height={90}
                  style={{
                    borderRadius: 14,
                    border: "1px solid #2f5f8f",
                    backgroundColor: "white",
                  }}
                />
              </div>
            )}
            <div
              style={{
                flex: 1,
                display: "flex",
                flexDirection: "column",
                paddingRight: avatarDataUrl ? 15 : 0,
              }}
            >
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  lineHeight: 1.1,
                  color: "white",
                  marginBottom: 2,
                }}
              >
                {sig.name}
              </div>
              <div
                style={{
                  fontSize: 14,
                  lineHeight: 1.3,
                  color: "#a9c6e0",
                  marginBottom: 6,
                }}
              >
                {sig.title}
              </div>
              <div
                style={{
                  borderTop: "2px solid #7bb32e",
                  marginBottom: 8,
                }}
              />
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "white",
                }}
              >
                {sig.phone}
              </div>
              <div
                style={{
                  fontSize: 13,
                  lineHeight: 1.5,
                  color: "white",
                }}
              >
                {sig.email}
              </div>
              {sig.website && (
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: "white",
                  }}
                >
                  {sig.website}
                </div>
              )}
              {sig.address && (
                <div
                  style={{
                    fontSize: 13,
                    lineHeight: 1.5,
                    color: "white",
                  }}
                >
                  {sig.address}
                </div>
              )}
            </div>
            {avatarDataUrl && (
              <div
                style={{
                  width: 100,
                  display: "flex",
                  justifyContent: "flex-end",
                  flexShrink: 0,
                }}
              >
                <img
                  src={avatarDataUrl}
                  width={90}
                  height={90}
                  style={{
                    borderRadius: 16,
                    border: "2px solid white",
                    backgroundColor: "white",
                  }}
                />
              </div>
            )}
          </div>
          <div
            style={{
              borderTop: "2px solid #2f5f8f",
              marginTop: 16,
              marginBottom: 14,
            }}
          />
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center" }}>
            <div style={{ display: "flex", flexDirection: "row" }}>
              {sig.facebookUrl && (
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: "#1877F2",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "white",
                    marginRight: 6,
                    fontFamily: "Inter",
                  }}
                >
                  f
                </div>
              )}
              {sig.instagramUrl && (
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: "#E4405F",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 11,
                    fontWeight: 700,
                    color: "white",
                    marginRight: 6,
                    fontFamily: "Inter",
                  }}
                >
                  ig
                </div>
              )}
              {sig.youtubeUrl && (
                <div
                  style={{
                    width: 26,
                    height: 26,
                    borderRadius: 13,
                    backgroundColor: "#FF0000",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    fontSize: 14,
                    color: "white",
                    marginRight: 6,
                    fontFamily: "Inter",
                  }}
                >
                  ▶
                </div>
              )}
            </div>
            <div style={{ flex: 1, textAlign: "right" }}>
              {sig.taglineLine1 && (
                <div
                  style={{
                    fontSize: 14,
                    color: "#a9c6e0",
                    lineHeight: 1.2,
                  }}
                >
                  {sig.taglineLine1}
                </div>
              )}
              {sig.taglineLine2 && (
                <div
                  style={{
                    fontSize: 18,
                    fontWeight: 700,
                    color: "white",
                    lineHeight: 1.2,
                  }}
                >
                  {sig.taglineLine2}
                </div>
              )}
            </div>
          </div>
        </div>
      ),
      {
        width: 600,
        height: logoDataUrl || avatarDataUrl ? 240 : 220,
        emoji: "twemoji",
        fonts: fontData
          ? [
              { name: "Inter", data: fontData, weight: 400, style: "normal" },
              { name: "Inter", data: fontData, weight: 700, style: "normal" },
            ]
          : undefined,
        headers: {
          "Cache-Control": "public, max-age=86400",
        },
      }
    );
  } catch (error) {
    console.error("sig-image error:", error);
    return new Response("Image generation failed", { status: 500 });
  }
}
