import { NextResponse } from "next/server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ url: string }> }
) {
  try {
    const { url: encodedUrl } = await params;
    const blobUrl = decodeURIComponent(encodedUrl);

    if (!blobUrl.includes("blob.vercel-storage.com")) {
      return new Response("Invalid URL", { status: 400 });
    }

    const token = process.env.BLOB_READ_WRITE_TOKEN;
    if (!token) {
      return new Response("No blob token", { status: 500 });
    }

    const response = await fetch(blobUrl, {
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      return new Response("Failed to fetch", { status: 502 });
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
