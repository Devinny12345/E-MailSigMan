"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import SignatureForm from "@/app/components/SignatureForm";
import { type SignatureData } from "@/lib/generateHtml";

export default function EditSignaturePage() {
  const params = useParams();
  const router = useRouter();
  const [signature, setSignature] = useState<SignatureData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/signatures/${params.id}`)
      .then((r) => {
        if (!r.ok) throw new Error("Not found");
        return r.json();
      })
      .then((data) => {
        setSignature(data);
        setLoading(false);
      })
      .catch(() => {
        alert("Signature not found");
        router.push("/admin");
      });
  }, [params.id, router]);

  if (loading || !signature) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold text-slate-900">Edit Signature</h1>
        </div>
      </header>
      <main className="max-w-4xl mx-auto px-6 py-8">
        <div className="bg-white rounded-xl border border-slate-200 p-8">
          <SignatureForm mode="edit" initialData={signature} />
        </div>
      </main>
    </div>
  );
}
