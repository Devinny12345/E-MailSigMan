"use client";

import { useState } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { useQuery, useMutation } from "convex/react";
import { api } from "@convex/_generated/api";
import { generateSignatureHtml } from "@/lib/generateHtml";

type RenderStatus = "idle" | "rendering" | "success" | "error";
type ImageFormat = "png" | "jpeg";

export default function SignaturePreviewPage() {
  const params = useParams();
  const [copied, setCopied] = useState(false);
  const [copiedImg, setCopiedImg] = useState(false);
  const [copiedRendered, setCopiedRendered] = useState(false);
  const [renderStatus, setRenderStatus] = useState<RenderStatus>("idle");
  const [renderedUrl, setRenderedUrl] = useState<string | null>(null);
  const [renderError, setRenderError] = useState<string | null>(null);
  const [selectedFormat, setSelectedFormat] = useState<ImageFormat>("png");
  const [validationErrors, setValidationErrors] = useState<string[]>([]);

  const rawSig = useQuery(api.signatures.get, { id: params.id as any });
  const updateImageUrl = useMutation(api.signatures.updateImageUrl);

  if (!rawSig) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <p className="text-slate-500">Loading...</p>
      </div>
    );
  }

  const sig = { ...rawSig, id: rawSig._id };

  const baseUrl = typeof window !== "undefined" ? window.location.origin : "https://e-mail-sig-man.vercel.app";
  const htmlSnippet = generateSignatureHtml(sig, baseUrl);
  const gifUrl = `${baseUrl}/api/serve-gif/${sig.id}`;

  const validateSignature = (): boolean => {
    const errors: string[] = [];
    if (!sig.name?.trim()) errors.push("Name is required");
    if (!sig.email?.trim()) errors.push("Email is required");
    if (!sig.title?.trim()) errors.push("Title is required");
    setValidationErrors(errors);
    return errors.length === 0;
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(htmlSnippet);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleRender = async () => {
    if (!validateSignature()) return;

    setRenderStatus("rendering");
    setRenderError(null);
    try {
      const res = await fetch(`/api/render/${sig.id}?format=${selectedFormat}`, {
        method: "POST",
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Render failed");
      }
      const { url } = await res.json();
      setRenderedUrl(url);
      setRenderStatus("success");
    } catch (e: any) {
      setRenderError(e.message || "Render failed");
      setRenderStatus("error");
    }
  };

  const displayRenderedUrl = renderedUrl || sig.imageUrl || null;

  const getStatusColor = () => {
    switch (renderStatus) {
      case "rendering": return "bg-yellow-500";
      case "success": return "bg-green-500";
      case "error": return "bg-red-500";
      default: return "bg-slate-300";
    }
  };

  const getStatusLabel = () => {
    switch (renderStatus) {
      case "rendering": return "Rendering...";
      case "success": return "Rendered";
      case "error": return "Failed";
      default: return "Ready";
    }
  };

  const handleCopyUrl = (url: string, setCopied: (v: boolean) => void) => {
    navigator.clipboard.writeText(url);
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
        {/* Live Preview */}
        <div className="rounded-xl border border-slate-200 p-6" style={{ backgroundColor: "#0d3b66" }}>
          <h2 className="text-sm font-semibold text-white/60 uppercase mb-4">Live Preview</h2>
          <div className="bg-white rounded-lg overflow-hidden shadow-lg" dangerouslySetInnerHTML={{ __html: htmlSnippet }} />
        </div>

        {/* Looping GIF */}
        {sig.loopingGifUrl && (
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <h2 className="text-sm font-semibold text-slate-500 uppercase mb-3">Looping GIF (served dynamically)</h2>
            <p className="text-xs text-slate-400 mb-3 font-mono">{gifUrl}</p>
            <img src={sig.loopingGifUrl} alt="Looping GIF" className="max-w-xs rounded" />
          </div>
        )}

        {/* Render Image Section */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase">Render Static Image</h2>
            <div className="flex items-center gap-3">
              <span className="flex items-center gap-2 text-sm text-slate-600">
                <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: getStatusColor() }} />
                <span>{getStatusLabel()}</span>
              </span>
            </div>
          </div>

          {/* Validation Errors */}
          {validationErrors.length > 0 && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-xs font-medium text-red-800 mb-1">Fix these before rendering:</p>
              <ul className="text-xs text-red-700 space-y-1 list-disc list-inside">
                {validationErrors.map((err, i) => (
                  <li key={i}>{err}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Format Selection */}
          <div className="mb-4">
            <label className="text-xs text-slate-500 mb-2 block">Format</label>
            <div className="flex gap-3">
              {(["png", "jpeg"] as ImageFormat[]).map((fmt) => (
                <button
                  key={fmt}
                  onClick={() => setSelectedFormat(fmt)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium border-2 transition ${
                    selectedFormat === fmt
                      ? "border-blue-500 bg-blue-50 text-blue-700"
                      : "border-slate-200 text-slate-600 hover:border-slate-300"
                  }`}
                >
                  {fmt.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <p className="text-xs text-slate-400 mb-4">
            Generates a static image stored on Convex. The URL is permanent and works in email clients (Gmail, Outlook, etc.).
          </p>

          {/* Render Button */}
          <button
            onClick={handleRender}
            disabled={renderStatus === "rendering" || validationErrors.length > 0}
            className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed w-full sm:w-auto"
          >
            {renderStatus === "rendering"
              ? "Rendering..."
              : displayRenderedUrl
              ? "Re-render"
              : "Render Image"}
          </button>

          {/* Error Message */}
          {renderError && (
            <p className="mt-3 text-sm text-red-600 flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
              {renderError}
            </p>
          )}

          {/* Live Preview of Rendered Image + Copy URL */}
          {displayRenderedUrl && (
            <div className="mt-6 space-y-3">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  readOnly
                  value={displayRenderedUrl}
                  className="flex-1 bg-slate-50 border border-slate-200 rounded-lg p-3 text-sm text-slate-700 font-mono outline-none"
                  onClick={(e) => e.currentTarget.select()}
                />
                <button
                  onClick={() => handleCopyUrl(displayRenderedUrl, setCopiedRendered)}
                  className="bg-slate-100 text-slate-700 px-4 py-2 rounded-lg hover:bg-slate-200 transition text-sm font-medium border border-slate-200 whitespace-nowrap"
                >
                  {copiedRendered ? "Copied!" : "Copy URL"}
                </button>
              </div>

              {/* Live Image Preview */}
              <div className="bg-slate-50 rounded-lg p-4 border border-slate-200">
                <p className="text-xs text-slate-500 mb-2">Live preview (this is the actual hosted image):</p>
                <img
                  src={displayRenderedUrl}
                  alt="Rendered Signature"
                  className="rounded border border-slate-200 max-w-full shadow-sm"
                  onLoad={() => setRenderStatus("success")}
                  onError={() => setRenderError("Failed to load rendered image")}
                />
              </div>

              {/* Usage hint */}
              <p className="text-xs text-slate-500">
                Use this URL directly in Gmail/Outlook signature settings, or in HTML:
                <code className="ml-2 bg-slate-100 px-1.5 py-0.5 rounded text-slate-700 font-mono text-[10px]">
                  {'<img src="' + displayRenderedUrl + '" alt="Signature">'}
                </code>
              </p>
            </div>
          )}
        </div>

        {/* Public Link */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase">Public Link</h2>
            <button
              onClick={() => handleCopyUrl(`${baseUrl}/s/${sig.id}`, setCopied)}
              className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-lg hover:bg-slate-200 transition text-sm font-medium border border-slate-200"
            >
              {copied ? "Copied!" : "Copy Link"}
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

        {/* Dynamic Image URL */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase">Dynamic Image URL</h2>
            <button
              onClick={() => handleCopyUrl(`${baseUrl}/signatures/${sig.id}.png`, setCopiedImg)}
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
            Generated on-the-fly each request. Use <strong>Render Image</strong> above for a permanent static file.
          </p>
        </div>

        {/* Email HTML (Image) */}
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-slate-500 uppercase">Email HTML (Image)</h2>
            <button
              onClick={() => {
                const imgSrc = displayRenderedUrl || `${baseUrl}/signatures/${sig.id}.png`;
                navigator.clipboard.writeText(`<img src="${imgSrc}" alt="Email Signature">`);
                setCopied(true);
                setTimeout(() => setCopied(false), 2000);
              }}
              className="bg-slate-100 text-slate-700 px-4 py-1.5 rounded-lg hover:bg-slate-200 transition text-sm font-medium border border-slate-200"
            >
              Copy HTML
            </button>
          </div>
          <pre className="bg-slate-50 border border-slate-200 rounded-lg p-4 text-xs text-slate-700 overflow-x-auto whitespace-pre-wrap max-h-64">
            {(() => {
              const imgSrc = displayRenderedUrl || `${baseUrl}/signatures/${sig.id}.png`;
              return `<img src="${imgSrc}" alt="Email Signature">`;
            })()}
          </pre>
        </div>

        {/* HTML Snippet */}
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

        {/* Details */}
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
