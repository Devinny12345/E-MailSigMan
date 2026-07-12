"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { generateSignatureHtml, type SignatureData } from "@/lib/generateHtml";

export default function SignaturePreviewPage() {
  const params = useParams();
  const [sig, setSig] = useState<SignatureData | null>(null);
  const [copied, setCopied] = useState(false);
  const [copiedImg, setCopiedImg] = useState(false);

  useEffect(() => {
    fetch(`/api/signatures/${params.id}`)
      .then((r) => r.json())
      .then(setSig);
  }, [params.id]);

  if (!sig) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://e-mail-sig-man.vercel.app";
  const htmlSnippet = generateSignatureHtml(sig, baseUrl);
  const gifUrl = `${baseUrl}/api/serve-gif/${sig.id}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <h1 className="text-2xl font-bold text-slate-900">Signature Preview</h1>
          <div className="flex gap-3">
            <Link href={`/admin/edit/${sig.id}`} className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition font-medium text-sm">
              Edit
            </Link>
            <Link href={`/s/${sig.id}`} target="_blank" className="border border-slate-300 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-50 transition font-medium text-sm">
              Public Link
            </Link>
            <Link href="/admin" className="text-slate-600 hover:text-slate-700 text-sm font-medium py-2">
              Back to Dashboard
            </Link>
          </div>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-8 space-y-8">
        <div className="rounded-xl border border-slate-200 p-6" style={{ backgroundColor: "#0d3b66" }}>
          <h2 className="text-sm font-semibold text-white/60 uppercase mb-4">Live Preview</h2>
          <div className="bg-white rounded-lg overflow-hidden shadow-lg" dangerouslySetInnerHTML={{ __html: htmlSnippet }} />
        </div>

        {sig.loopingGifUrl && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">Looping GIF (served dynamically)</h2>
            <p className="text-xs text-slate-400 mb-3 font-mono">{gifUrl}</p>
            <img src={sig.loopingGifUrl} alt="Looping GIF" className="max-w-xs rounded" />
          </div>
        )}

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase">Public Link</h2>
            <button 
              onClick={() => {
                navigator.clipboard.writeText(`${baseUrl}/s/${sig.id}`);
              }} 
              className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-lg hover:bg-slate-200 transition text-sm font-medium border border-slate-200"
            >
              Copy Link
            </button>
          </div>
          <input 
            type="text" 
            readOnly 
            value={`${baseUrl}/s/${sig.id}`} 
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700 font-mono outline-none" 
            onClick={(e) => e.currentTarget.select()}
          />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase">Signature Image URL</h2>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`${baseUrl}/signatures/${sig.id}.png`);
                setCopiedImg(true);
                setTimeout(() => setCopiedImg(false), 2000);
              }}
              className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-lg hover:bg-slate-200 transition text-sm font-medium border border-slate-200"
            >
              {copiedImg ? "Copied!" : "Copy URL"}
            </button>
          </div>
          <input
            type="text"
            readOnly
            value={`${baseUrl}/signatures/${sig.id}.png`}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700 font-mono outline-none"
            onClick={(e) => e.currentTarget.select()}
          />
          <p className="text-xs text-slate-400 mt-2">
            Permanent image URL — use in <code className="text-xs bg-slate-100 px-1 rounded">{'<img>'}</code> tags for email signatures. Updates automatically when you save.
          </p>
          {sig.imageUrl && (
            <img
              src={sig.imageUrl}
              alt="Signature"
              className="mt-4 rounded border border-slate-200 max-w-full"
            />
          )}
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase">Email HTML (Image)</h2>
            <button
              onClick={() => {
                navigator.clipboard.writeText(`<img src="${baseUrl}/signatures/${sig.id}.png" alt="Email Signature">`);
              }}
              className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-lg hover:bg-slate-200 transition text-sm font-medium border border-slate-200"
            >
              Copy HTML
            </button>
          </div>
          <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap max-h-64">
            {`<img src="${baseUrl}/signatures/${sig.id}.png" alt="Email Signature">`}
          </pre>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase">HTML Snippet</h2>
            <button onClick={handleCopy} className="bg-blue-600 text-white px-4 py-1.5 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
              {copied ? "Copied!" : "Copy HTML"}
            </button>
          </div>
          <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap max-h-64">
            {htmlSnippet}
          </pre>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">Details</h2>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <dt className="text-slate-500">Tag</dt>
            <dd className="text-slate-900">{sig.tag || "—"}</dd>
            <dt className="text-slate-500">Status</dt>
            <dd className="text-slate-900">{sig.isActive ? "Active" : "Inactive"}</dd>
            <dt className="text-slate-500">Website</dt>
            <dd className="text-slate-900">{sig.website || "—"}</dd>
            <dt className="text-slate-500">Address</dt>
            <dd className="text-slate-900">{sig.address || "—"}</dd>
          </dl>
        </div>
      </main>
    </div>
  );
}
