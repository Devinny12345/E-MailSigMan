import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center" style={{ backgroundColor: "#0d3b66" }}>
      <div className="text-center">
        <h1 className="text-6xl font-bold text-white mb-4">404</h1>
        <p className="text-white/60 text-lg mb-8">Page not found</p>
        <Link href="/admin" className="text-blue-400 hover:text-blue-300 font-medium">
          ← Back to Dashboard
        </Link>
      </div>
    </div>
  );
}
