import { prisma } from "@/lib/prisma";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const signature = await prisma.signature.findUnique({ where: { id } });

  if (!signature || !signature.loopingGifUrl) {
    return new Response("Not found", { status: 404 });
  }

  const response = await fetch(signature.loopingGifUrl);

  if (!response.ok) {
    return new Response("Failed to fetch image", { status: 502 });
  }

  const blob = await response.blob();

  return new Response(blob, {
    headers: {
      "Content-Type": "image/gif",
      "Cache-Control": "no-cache, max-age=0",
    },
  });
}
