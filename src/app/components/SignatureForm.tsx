"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation } from "convex/react";
import { api } from "@convex/_generated/api";

interface FormData {
  name: string;
  title: string;
  email: string;
  phone: string;
  avatarUrl: string;
  loopingGifUrl: string;
  landingPageUrl: string;
  tag: string;
  isActive: boolean;
  companyLogoUrl: string;
  website: string;
  address: string;
  facebookUrl: string;
  instagramUrl: string;
  youtubeUrl: string;
  taglineLine1: string;
  taglineLine2: string;
}

interface Props {
  initialData?: FormData & { id: string };
  mode: "create" | "edit";
}

const defaultForm: FormData = {
  name: "",
  title: "",
  email: "",
  phone: "",
  avatarUrl: "",
  loopingGifUrl: "",
  landingPageUrl: "",
  tag: "",
  isActive: true,
  companyLogoUrl: "",
  website: "",
  address: "",
  facebookUrl: "",
  instagramUrl: "",
  youtubeUrl: "",
  taglineLine1: "",
  taglineLine2: "",
};

export default function SignatureForm({ initialData, mode }: Props) {
  const router = useRouter();
  const [form, setForm] = useState<FormData>(initialData || defaultForm);
  const [uploading, setUploading] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const createSignature = useMutation(api.signatures.create);
  const updateSignature = useMutation(api.signatures.update);

  const handleFileUpload = async (field: "avatarUrl" | "loopingGifUrl" | "companyLogoUrl", file: File) => {
    setUploading(field);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      if (!res.ok) {
        const err = await res.json();
        alert(err.error || "Upload failed");
        return;
      }
      const { url } = await res.json();
      setForm((prev) => ({ ...prev, [field]: url }));
    } catch {
      alert("Upload failed");
    } finally {
      setUploading(null);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    try {
      if (mode === "edit" && initialData) {
        const result = await updateSignature({
          id: initialData.id as any,
          name: form.name,
          title: form.title,
          email: form.email,
          phone: form.phone,
          avatarUrl: form.avatarUrl,
          loopingGifUrl: form.loopingGifUrl,
          landingPageUrl: form.landingPageUrl,
          tag: form.tag,
          isActive: form.isActive,
          companyLogoUrl: form.companyLogoUrl,
          website: form.website,
          address: form.address,
          facebookUrl: form.facebookUrl,
          instagramUrl: form.instagramUrl,
          youtubeUrl: form.youtubeUrl,
          taglineLine1: form.taglineLine1,
          taglineLine2: form.taglineLine2,
        });
        router.push(`/admin/signature/${result!._id}`);
      } else {
        const result = await createSignature({
          name: form.name,
          title: form.title,
          email: form.email,
          phone: form.phone,
          avatarUrl: form.avatarUrl,
          loopingGifUrl: form.loopingGifUrl,
          landingPageUrl: form.landingPageUrl,
          tag: form.tag,
          isActive: form.isActive,
          companyLogoUrl: form.companyLogoUrl,
          website: form.website,
          address: form.address,
          facebookUrl: form.facebookUrl,
          instagramUrl: form.instagramUrl,
          youtubeUrl: form.youtubeUrl,
          taglineLine1: form.taglineLine1,
          taglineLine2: form.taglineLine2,
        });
        router.push("/admin");
      }
    } catch {
      alert("Failed to save");
    } finally {
      setSaving(false);
    }
  };

  const inputClass = "w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent";
  const labelClass = "block text-sm font-medium text-slate-700 mb-1";
  const fileClass = "w-full text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100";

  const set = (field: keyof FormData, value: string | boolean) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* PERSONAL INFO */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4">Personal Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Full Name *</label>
            <input type="text" required value={form.name} onChange={(e) => set("name", e.target.value)} className={inputClass} placeholder="Jane Smith" />
          </div>
          <div>
            <label className={labelClass}>Job Title *</label>
            <input type="text" required value={form.title} onChange={(e) => set("title", e.target.value)} className={inputClass} placeholder="Senior Engineer" />
          </div>
          <div>
            <label className={labelClass}>Email *</label>
            <input type="email" required value={form.email} onChange={(e) => set("email", e.target.value)} className={inputClass} placeholder="jane@company.com" />
          </div>
          <div>
            <label className={labelClass}>Phone *</label>
            <input type="text" required value={form.phone} onChange={(e) => set("phone", e.target.value)} className={inputClass} placeholder="+1 (555) 123-4567" />
          </div>
        </div>
      </div>

      {/* IMAGES */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4">Images</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Employee Photo</label>
            <input type="file" accept=".png,.gif,image/png,image/gif" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload("avatarUrl", f); }} disabled={uploading === "avatarUrl"} className={fileClass} />
            {uploading === "avatarUrl" && <p className="text-xs text-slate-500 mt-1">Uploading...</p>}
            {form.avatarUrl && <img src={form.avatarUrl} alt="Avatar" className="w-16 h-16 rounded-2xl object-cover border-2 border-white mt-2 shadow" />}
          </div>
          <div>
            <label className={labelClass}>Company Logo</label>
            <input type="file" accept=".png,.gif,image/png,image/gif" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload("companyLogoUrl", f); }} disabled={uploading === "companyLogoUrl"} className={fileClass} />
            {uploading === "companyLogoUrl" && <p className="text-xs text-slate-500 mt-1">Uploading...</p>}
            {form.companyLogoUrl && <img src={form.companyLogoUrl} alt="Logo" className="h-16 rounded-lg border mt-2" />}
          </div>
          <div>
            <label className={labelClass}>Looping GIF</label>
            <input type="file" accept=".gif,.png,image/gif,image/png" onChange={(e) => { const f = e.target.files?.[0]; if (f) handleFileUpload("loopingGifUrl", f); }} disabled={uploading === "loopingGifUrl"} className={fileClass} />
            {uploading === "loopingGifUrl" && <p className="text-xs text-slate-500 mt-1">Uploading...</p>}
            {form.loopingGifUrl && <img src={form.loopingGifUrl} alt="GIF" className="h-16 rounded border mt-2" />}
          </div>
        </div>
      </div>

      {/* COMPANY INFO */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4">Company Info</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Website</label>
            <input type="text" value={form.website} onChange={(e) => set("website", e.target.value)} className={inputClass} placeholder="company.com" />
          </div>
          <div>
            <label className={labelClass}>Address</label>
            <input type="text" value={form.address} onChange={(e) => set("address", e.target.value)} className={inputClass} placeholder="123 Main St, City" />
          </div>
          <div>
            <label className={labelClass}>Landing Page URL</label>
            <input type="url" value={form.landingPageUrl} onChange={(e) => set("landingPageUrl", e.target.value)} className={inputClass} placeholder="https://company.com/landing" />
          </div>
          <div>
            <label className={labelClass}>Tag (Campaign/Dept)</label>
            <input type="text" value={form.tag} onChange={(e) => set("tag", e.target.value)} className={inputClass} placeholder="Q3-Campaign" />
          </div>
        </div>
      </div>

      {/* SOCIAL LINKS */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className={labelClass}>Facebook URL</label>
            <input type="url" value={form.facebookUrl} onChange={(e) => set("facebookUrl", e.target.value)} className={inputClass} placeholder="https://facebook.com/..." />
          </div>
          <div>
            <label className={labelClass}>Instagram URL</label>
            <input type="url" value={form.instagramUrl} onChange={(e) => set("instagramUrl", e.target.value)} className={inputClass} placeholder="https://instagram.com/..." />
          </div>
          <div>
            <label className={labelClass}>YouTube URL</label>
            <input type="url" value={form.youtubeUrl} onChange={(e) => set("youtubeUrl", e.target.value)} className={inputClass} placeholder="https://youtube.com/..." />
          </div>
        </div>
      </div>

      {/* TAGLINE */}
      <div>
        <h3 className="text-sm font-semibold text-slate-500 uppercase mb-4">Tagline</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className={labelClass}>Tagline Line 1</label>
            <input type="text" value={form.taglineLine1} onChange={(e) => set("taglineLine1", e.target.value)} className={inputClass} placeholder="Your trusted partner" />
          </div>
          <div>
            <label className={labelClass}>Tagline Line 2</label>
            <input type="text" value={form.taglineLine2} onChange={(e) => set("taglineLine2", e.target.value)} className={inputClass} placeholder="Since 1990" />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <input type="checkbox" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4 text-blue-600 rounded" />
        <label className="text-sm text-slate-700">Active</label>
      </div>

      <div className="flex gap-3">
        <button type="submit" disabled={saving || uploading !== null} className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50">
          {saving ? "Saving..." : mode === "edit" ? "Update Signature" : "Create Signature"}
        </button>
        <button type="button" onClick={() => router.push("/admin")} className="border border-slate-300 text-slate-700 px-6 py-2 rounded-lg hover:bg-slate-50 transition font-medium">
          Cancel
        </button>
      </div>
    </form>
  );
}
