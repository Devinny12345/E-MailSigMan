import { httpRouter } from "convex/server";
import { httpAction } from "./_generated/server";

const http = httpRouter();

const CORS_HEADERS = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type",
};

http.route({
  path: "/upload",
  method: "POST",
  handler: httpAction(async (ctx, request) => {
    try {
      const formData = await request.formData();
      const file = formData.get("file") as File | null;

      if (!file) {
        return new Response(JSON.stringify({ error: "No file provided" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      }

      const allowedTypes = ["image/gif", "image/png", "image/jpeg"];
      if (!allowedTypes.includes(file.type)) {
        return new Response(JSON.stringify({ error: "Only .gif, .png, and .jpg files are allowed" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      }

      const maxSize = 1024 * 1024;
      if (file.size > maxSize) {
        return new Response(JSON.stringify({ error: "File must be under 1MB" }), {
          status: 400,
          headers: { "Content-Type": "application/json", ...CORS_HEADERS },
        });
      }

      const blob = new Blob([await file.arrayBuffer()], { type: file.type });
      const storageId = await ctx.storage.store(blob);

      return new Response(JSON.stringify({ storageId }), {
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    } catch (error) {
      return new Response(JSON.stringify({ error: String(error) }), {
        status: 500,
        headers: { "Content-Type": "application/json", ...CORS_HEADERS },
      });
    }
  }),
});

http.route({
  path: "/files/:storageId",
  method: "GET",
  handler: httpAction(async (ctx, request) => {
    const storageId = new URL(request.url).pathname.split("/").pop();

    if (!storageId) {
      return new Response("Invalid path", { status: 400 });
    }

    const blob = await ctx.storage.get(storageId as any);
    if (!blob) {
      return new Response("Not found", { status: 404 });
    }

    return new Response(blob, {
      headers: {
        "Content-Type": blob.type || "application/octet-stream",
        "Cache-Control": "public, max-age=31536000, immutable",
        ...CORS_HEADERS,
      },
    });
  }),
});

export default http;
