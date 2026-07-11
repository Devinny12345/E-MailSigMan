import { prisma } from "@/lib/prisma";
import { generateSignatureHtml } from "@/lib/generateHtml";
import { headers } from "next/headers";

export default async function PublicSignaturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const h = await headers();
  const host = h.get("x-forwarded-host") || h.get("host") || "e-mail-sig-man-6qlb.vercel.app";
  const proto = h.get("x-forwarded-proto") || "https";
  const baseUrl = `${proto}://${host}`;

  const sig = await prisma.signature.findUnique({ where: { id } });

  if (!sig || !sig.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0d3b66" }}>
        <p className="text-white/60 text-lg">Signature not found or inactive.</p>
      </div>
    );
  }

  const htmlSnippet = generateSignatureHtml(sig as Parameters<typeof generateSignatureHtml>[0], baseUrl);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#0d3b66" }}>
      <div dangerouslySetInnerHTML={{ __html: htmlSnippet }} />
    </div>
  );
}
