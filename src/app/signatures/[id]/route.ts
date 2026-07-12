import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";
import { generateSignatureImage } from "@/lib/generateImage";

export const runtime = "nodejs";

const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const sig = await convex.query(api.signatures.get, { id: id as any });
    if (!sig) {
      return new Response("Not found", { status: 404 });
    }

    let imageUrl = sig.imageUrl;

    if (!imageUrl) {
      imageUrl = await generateSignatureImage({
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
      });

      await convex.mutation(api.signatures.updateImageUrl, { id: sig._id, imageUrl });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    const headers: Record<string, string> = {};
    if (token && imageUrl.includes("blob.vercel-storage.com")) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(imageUrl, { headers, signal: AbortSignal.timeout(10000) });
    if (!response.ok) {
      return new Response("Failed to fetch image", { status: 502 });
    }

    const buffer = await response.arrayBuffer();

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error) {
    console.error("signatures/[id] error:", error);
    return new Response("Error", { status: 500 });
  }
}
