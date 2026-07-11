import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string[] }> }
) {
  try {
    const [id, type] = await params.id;

    if (!id || !type) {
      return new Response("Invalid path", { status: 400 });
    }

    const sig = await prisma.signature.findUnique({ where: { id } });
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

    const token = process.env.BLOB_READ_WRITE_TOKEN;

    const headers: Record<string, string> = {};
    if (token && imageUrl.includes("blob.vercel-storage.com")) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(imageUrl, { headers });

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
