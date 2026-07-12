import SignatureForm from "@/app/components/SignatureForm";

export const dynamic = "force-dynamic";

export default function NewSignaturePage() {
  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900">New Signature</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <SignatureForm mode="create" />
        </div>
      </main>
    </div>
  );
}
