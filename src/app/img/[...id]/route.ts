import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";

function getConvex() {
  return new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string[] }> }
) {
  try {
    const convex = getConvex();
    const { id: idArr } = await params;
    const [id, type] = idArr;

    if (!id || !type) {
      return new Response("Invalid path", { status: 400 });
    }

    const sig = await convex.query(api.signatures.get, { id: id as any });
    if (!sig) {
      return new Response("Not found", { status: 404 });
    }

    let imageUrl: string | null = null;
    if (type === "avatar") imageUrl = sig.avatarUrl || null;
    else if (type === "logo") imageUrl = sig.companyLogoUrl || null;
    else if (type === "gif") imageUrl = sig.loopingGifUrl || null;
    else {
      return new Response("Invalid type", { status: 400 });
    }

    if (!imageUrl) {
      return new Response("No image", { status: 404 });
    }

    const response = await fetch(imageUrl);

    if (!response.ok) {
      return new Response("Failed to fetch image", { status: 502 });
    }

    const contentType = response.headers.get("content-type") || "image/png";
    const blob = await response.arrayBuffer();

    return new Response(blob, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return new Response("Error", { status: 500 });
  }
}
