import { prisma } from "@/lib/prisma";
import { generateSignatureHtml } from "@/lib/generateHtml";

export default async function PublicSignaturePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const sig = await prisma.signature.findUnique({ where: { id } });

  if (!sig || !sig.isActive) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0d3b66" }}>
        <p className="text-white/60 text-lg">Signature not found or inactive.</p>
      </div>
    );
  }

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:4000";
  const htmlSnippet = generateSignatureHtml(sig as Parameters<typeof generateSignatureHtml>[0], baseUrl);

  return (
    <div className="min-h-screen flex items-center justify-center p-6" style={{ backgroundColor: "#0d3b66" }}>
      <div dangerouslySetInnerHTML={{ __html: htmlSnippet }} />
    </div>
  );
}
