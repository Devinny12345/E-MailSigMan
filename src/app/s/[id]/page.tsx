import { fetchQuery } from "convex/nextjs";
import { api } from "@convex/_generated/api";
import { generateSignatureHtml } from "@/lib/generateHtml";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";

export default async function PublicSignaturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "e-mail-sig-man.vercel.app";
  const proto = h.get("x-forwarded-proto") || "https";
  const baseUrl = `${proto}://${host}`;

  const sig = await fetchQuery(api.signatures.get, { id: id as any });

  if (!sig || !sig.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0d3b66" }}>
        <p className="text-white/60 text-lg">Signature not found or inactive.</p>
      </div>
    );
  }

  const sigData = { ...sig, id: sig._id };
  const htmlSnippet = generateSignatureHtml(sigData, baseUrl);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#0d3b66" }}>
      <div dangerouslySetInnerHTML={{ __html: htmlSnippet }} />
    </div>
  );
}
