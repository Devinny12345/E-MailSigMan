"use client";

import { useParams, useRouter } from "next/navigation";
import SignatureForm from "@/app/components/SignatureForm";
import { useQuery } from "convex/react";
import { api } from "@convex/_generated/api";

export default function EditSignaturePage() {
  const params = useParams();
  const router = useRouter();

  const rawSig = useQuery(api.signatures.get, { id: params.id as any });

  if (!rawSig) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  const signature = {
    id: rawSig._id,
    name: rawSig.name,
    title: rawSig.title,
    email: rawSig.email,
    phone: rawSig.phone,
    avatarUrl: rawSig.avatarUrl,
    loopingGifUrl: rawSig.loopingGifUrl,
    landingPageUrl: rawSig.landingPageUrl,
    tag: rawSig.tag,
    isActive: rawSig.isActive,
    companyLogoUrl: rawSig.companyLogoUrl,
    website: rawSig.website,
    address: rawSig.address,
    facebookUrl: rawSig.facebookUrl,
    instagramUrl: rawSig.instagramUrl,
    youtubeUrl: rawSig.youtubeUrl,
    taglineLine1: rawSig.taglineLine1,
    taglineLine2: rawSig.taglineLine2,
  };

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
