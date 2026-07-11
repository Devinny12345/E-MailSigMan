import { ImageResponse } from "next/og";
import { prisma } from "@/lib/prisma";

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

function socialCircle(label: string, bgColor: string) {
  return (
    <div
      style={{
        width: 26,
        height: 26,
        borderRadius: 13,
        backgroundColor: bgColor,
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
      {label}
    </div>
  );
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const sig = await prisma.signature.findUnique({ where: { id } });
  if (!sig) {
    return new Response("Not found", { status: 404 });
  }

  const fontData = await getFontData();

  const logoUrl = sig.companyLogoUrl || null;
  const avatarUrl = sig.avatarUrl || null;

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
          {logoUrl && (
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
                src={logoUrl}
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
              paddingRight: avatarUrl ? 15 : 0,
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
          {avatarUrl && (
            <div
              style={{
                width: 100,
                display: "flex",
                justifyContent: "flex-end",
                flexShrink: 0,
              }}
            >
              <img
                src={avatarUrl}
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
            {sig.facebookUrl && socialCircle("f", "#1877F2")}
            {sig.instagramUrl && socialCircle("ig", "#E4405F")}
            {sig.youtubeUrl && socialCircle("\u25B6", "#FF0000")}
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
      height: logoUrl || avatarUrl ? 240 : 220,
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
}
