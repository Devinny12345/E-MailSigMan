"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { type SignatureData } from "@/lib/generateHtml";

export default function AdminDashboard() {
  const router = useRouter();
  const [signatures, setSignatures] = useState<SignatureData[]>([]);
  const [tags, setTags] = useState<string[]>([]);
  const [selectedTag, setSelectedTag] = useState("all");
  const [loading, setLoading] = useState(true);

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST" });
    router.push("/admin/login");
  };

  const fetchSignatures = useCallback(async (tag?: string) => {
    setLoading(true);
    const url = tag && tag !== "all"
      ? `/api/signatures?tag=${encodeURIComponent(tag)}`
      : "/api/signatures";
    const res = await fetch(url);
    const data = await res.json();
    setSignatures(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSignatures(selectedTag);
  }, [selectedTag, fetchSignatures]);

  useEffect(() => {
    fetch("/api/signatures").then((r) => r.json()).then((data: SignatureData[]) => {
      const uniqueTags = [...new Set(data.map((s) => s.tag).filter(Boolean))];
      setTags(uniqueTags);
    });
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this signature?")) return;
    await fetch(`/api/signatures/${id}`, { method: "DELETE" });
    fetchSignatures(selectedTag);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Email Signatures</h1>
          <div className="flex items-center gap-3">
            <Link href="/admin/new" className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition font-medium">
              + New Signature
            </Link>
            <button onClick={handleLogout} className="border border-slate-300 text-slate-600 px-4 py-2 rounded-lg hover:bg-slate-50 transition font-medium text-sm">
              Sign Out
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="mb-6 flex items-center gap-4">
          <label className="text-sm font-medium text-slate-700">Filter by tag:</label>
          <select value={selectedTag} onChange={(e) => setSelectedTag(e.target.value)} className="border border-slate-300 rounded-lg px-3 py-2 text-sm bg-white">
            <option value="all">All Tags</option>
            {tags.map((tag) => (
              <option key={tag} value={tag}>{tag}</option>
            ))}
          </select>
        </div>

        {loading ? (
          <p className="text-slate-500">Loading...</p>
        ) : signatures.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-slate-200">
            <p className="text-slate-500 text-lg mb-4">No signatures yet</p>
            <Link href="/admin/new" className="text-blue-600 hover:text-blue-700 font-medium">
              Create your first signature
            </Link>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Name</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Title</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Email</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Tag</th>
                  <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Status</th>
                  <th className="text-right px-6 py-3 text-xs font-semibold text-slate-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {signatures.map((sig) => (
                  <tr key={sig.id} className="hover:bg-slate-50 transition">
                    <td className="px-6 py-4 font-medium text-slate-900">{sig.name}</td>
                    <td className="px-6 py-4 text-slate-600">{sig.title}</td>
                    <td className="px-6 py-4 text-slate-600">{sig.email}</td>
                    <td className="px-6 py-4">
                      {sig.tag && (
                        <span className="inline-block bg-blue-100 text-blue-800 text-xs font-medium px-2 py-1 rounded-full">
                          {sig.tag}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-block text-xs font-medium px-2 py-1 rounded-full ${sig.isActive ? "bg-green-100 text-green-800" : "bg-slate-100 text-slate-500"}`}>
                        {sig.isActive ? "Active" : "Inactive"}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right space-x-2">
                      <Link href={`/admin/signature/${sig.id}`} className="text-blue-600 hover:text-blue-700 text-sm font-medium">
                        Preview
                      </Link>
                      <Link href={`/admin/edit/${sig.id}`} className="text-slate-600 hover:text-slate-700 text-sm font-medium">
                        Edit
                      </Link>
                      <button onClick={() => handleDelete(sig.id)} className="text-red-600 hover:text-red-700 text-sm font-medium">
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
}
