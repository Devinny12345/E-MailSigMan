import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";
import { generateSignatureImage } from "@/lib/generateImage";

export const runtime = "nodejs";

function getConvex() {
  return new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;

    const convex = getConvex();
    const sig = await convex.query(api.signatures.get, { id: id as any });
    if (!sig) {
      return Response.json({ error: "Not found" }, { status: 404 });
    }

    const url = new URL(request.url);
    const format = (url.searchParams.get("format") as "png" | "jpeg") || "png";

    const imageBuffer = await generateSignatureImage(
      {
        id: sig._id,
        name: sig.name,
        title: sig.title,
        email: sig.email,
        phone: sig.phone,
        avatarUrl: sig.avatarUrl,
        companyLogoUrl: sig.companyLogoUrl,
        website: sig.website,
        address: sig.address,
        facebookUrl: sig.facebookUrl,
        instagramUrl: sig.instagramUrl,
        youtubeUrl: sig.youtubeUrl,
        taglineLine1: sig.taglineLine1,
        taglineLine2: sig.taglineLine2,
      },
      format
    );

    const siteUrl = process.env.NEXT_PUBLIC_CONVEX_SITE_URL;
    if (!siteUrl) {
      return Response.json({ error: "Convex site URL not configured" }, { status: 500 });
    }

    const mimeType = format === "jpeg" ? "image/jpeg" : "image/png";
    const ext = format === "jpeg" ? "jpg" : "png";

    const formData = new FormData();
    const blob = new Blob([new Uint8Array(imageBuffer)], { type: mimeType });
    formData.append("file", blob, `${sig._id}.${ext}`);

    const uploadRes = await fetch(`${siteUrl}/upload`, {
      method: "POST",
      body: formData,
    });

    if (!uploadRes.ok) {
      const err = await uploadRes.json();
      return Response.json({ error: err.error || "Upload failed" }, { status: 500 });
    }

    const { storageId } = await uploadRes.json();
    const imageUrl = `${siteUrl}/files/${storageId}`;

    await convex.mutation(api.signatures.updateImageUrl, {
      id: sig._id,
      imageUrl,
    });

    return Response.json({ url: imageUrl, format });
  } catch (error: any) {
    console.error("render error:", error?.message || error);
    return Response.json({ error: error?.message || "Render failed" }, { status: 500 });
  }
}
