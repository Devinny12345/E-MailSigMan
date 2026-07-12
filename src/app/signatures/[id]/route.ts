import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";
import { generateSignatureImage } from "@/lib/generateImage";

export const runtime = "nodejs";

function getConvex() {
  return new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const convex = getConvex();
    const sig = await convex.query(api.signatures.get, { id: id as any });
    if (!sig) {
      return new Response("Not found", { status: 404 });
    }

    const pngBuffer = await generateSignatureImage({
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

    return new Response(new Uint8Array(pngBuffer), {
      status: 200,
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400, s-maxage=86400",
        "Access-Control-Allow-Origin": "*",
      },
    });
  } catch (error: any) {
    console.error("signatures/[id] error:", error?.message || error);
    return new Response("Error: " + (error?.message || "unknown"), { status: 500 });
  }
}
