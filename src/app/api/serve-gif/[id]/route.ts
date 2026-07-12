import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const convex = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
  const { id } = await params;

  const signature = await convex.query(api.signatures.get, { id: id as any });

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
