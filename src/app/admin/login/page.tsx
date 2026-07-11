"use client";

import { Suspense, useState, FormEvent } from "react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const from = searchParams.get("from") || "/admin";

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      router.push(from);
      router.refresh();
    } else {
      setError("Incorrect password. Please try again.");
      setLoading(false);
    }
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: "linear-gradient(135deg, #0d3b66 0%, #0a2d4f 50%, #071e35 100%)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontFamily: "system-ui, -apple-system, sans-serif",
      padding: "24px",
    }}>
      <div style={{
        background: "rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255,255,255,0.12)",
        borderRadius: "24px",
        padding: "48px 40px",
        width: "100%",
        maxWidth: "400px",
        boxShadow: "0 32px 64px rgba(0,0,0,0.4)",
      }}>
        {/* Logo / Icon */}
        <div style={{ textAlign: "center", marginBottom: "32px" }}>
          <div style={{
            width: "64px",
            height: "64px",
            borderRadius: "16px",
            background: "linear-gradient(135deg, #7bb32e, #5a8a1e)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            margin: "0 auto 16px",
            fontSize: "28px",
          }}>
            ✉️
          </div>
          <h1 style={{
            color: "#ffffff",
            fontSize: "24px",
            fontWeight: "700",
            margin: "0 0 6px",
            letterSpacing: "-0.5px",
          }}>
            Email Signature Manager
          </h1>
          <p style={{ color: "rgba(255,255,255,0.5)", fontSize: "14px", margin: 0 }}>
            Sign in to your admin panel
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: "16px" }}>
            <label style={{
              display: "block",
              color: "rgba(255,255,255,0.7)",
              fontSize: "13px",
              fontWeight: "500",
              marginBottom: "8px",
              letterSpacing: "0.3px",
            }}>
              ADMIN PASSWORD
            </label>
            <input
              id="admin-password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
              autoFocus
              style={{
                width: "100%",
                padding: "12px 16px",
                borderRadius: "12px",
                border: error
                  ? "1px solid rgba(255,80,80,0.6)"
                  : "1px solid rgba(255,255,255,0.15)",
                background: "rgba(255,255,255,0.08)",
                color: "#ffffff",
                fontSize: "15px",
                outline: "none",
                boxSizing: "border-box",
                transition: "border-color 0.2s",
              }}
              onFocus={(e) => {
                if (!error) e.target.style.borderColor = "rgba(123,179,46,0.6)";
              }}
              onBlur={(e) => {
                if (!error) e.target.style.borderColor = "rgba(255,255,255,0.15)";
              }}
            />
            {error && (
              <p style={{
                color: "#ff6b6b",
                fontSize: "13px",
                marginTop: "8px",
                display: "flex",
                alignItems: "center",
                gap: "4px",
              }}>
                ⚠️ {error}
              </p>
            )}
          </div>

          <button
            type="submit"
            id="login-submit-btn"
            disabled={loading || !password}
            style={{
              width: "100%",
              padding: "13px",
              borderRadius: "12px",
              border: "none",
              background: loading || !password
                ? "rgba(123,179,46,0.4)"
                : "linear-gradient(135deg, #7bb32e, #5a8a1e)",
              color: "#ffffff",
              fontSize: "15px",
              fontWeight: "600",
              cursor: loading || !password ? "not-allowed" : "pointer",
              transition: "all 0.2s",
              letterSpacing: "0.3px",
              marginTop: "4px",
            }}
          >
            {loading ? "Signing in..." : "Sign In →"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default function AdminLoginPage() {
  return (
    <Suspense>
      <LoginForm />
    </Suspense>
  );
}
