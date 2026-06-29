"use client";

import { signIn } from "next-auth/react";
import { useState } from "react";

export default function LoginForm({ googleEnabled }: { googleEnabled: boolean }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [step, setStep] = useState<"email" | "name">("email");

  async function handleGoogle() {
    setLoading(true);
    await signIn("google", { callbackUrl: "/dashboard" });
  }

  async function handleContinue(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setStep("name");
  }

  async function handleEnter(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setLoading(true);
    setError("");
    const res = await signIn("credentials", {
      email: email.trim(),
      name: name.trim() || email.split("@")[0],
      callbackUrl: "/dashboard",
      redirect: true,
    });
    if (res?.error) {
      setError("No se pudo iniciar sesión.");
      setLoading(false);
    }
  }

  return (
    <div
      style={{
        background: "rgba(255,255,255,0.035)",
        border: "1px solid rgba(255,255,255,0.10)",
        borderTop: "1px solid rgba(255,255,255,0.18)",
        backdropFilter: "blur(32px)",
        WebkitBackdropFilter: "blur(32px)",
        borderRadius: 24,
        padding: "32px 28px",
        display: "flex",
        flexDirection: "column",
        gap: 16,
        boxShadow: "0 32px 80px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.12)",
      }}
    >
      {googleEnabled && (
        <>
          <button
            onClick={handleGoogle}
            disabled={loading}
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 10,
              width: "100%",
              padding: "13px 20px",
              borderRadius: 14,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(255,255,255,0.13)",
              color: "#E2E8F0",
              fontSize: 14,
              fontWeight: 600,
              cursor: "pointer",
              transition: "all 0.2s",
              fontFamily: "inherit",
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.12)")}
            onMouseLeave={(e) => (e.currentTarget.style.background = "rgba(255,255,255,0.07)")}
          >
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z"/>
              <path fill="#FF3D00" d="m6.306 14.691 6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"/>
              <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"/>
              <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002 6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z"/>
            </svg>
            Continuar con Google
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
            <span style={{ color: "#334155", fontSize: 12 }}>o continúa con email</span>
            <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.07)" }} />
          </div>
        </>
      )}

      <form onSubmit={step === "email" ? handleContinue : handleEnter} style={{ display: "flex", flexDirection: "column", gap: 12 }}>
        {step === "name" && (
          <div style={{ position: "relative" }}>
            <input
              type="text"
              placeholder="Tu nombre"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
              style={{
                width: "100%",
                padding: "13px 16px",
                borderRadius: 14,
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.10)",
                color: "#E2E8F0",
                fontSize: 14,
                fontFamily: "inherit",
                outline: "none",
                boxSizing: "border-box",
              }}
              onFocus={(e) => (e.target.style.borderColor = "rgba(79,70,229,0.6)")}
              onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.10)")}
            />
          </div>
        )}
        <div style={{ position: "relative" }}>
          <input
            type="email"
            placeholder="tu@email.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoFocus={step === "email"}
            readOnly={step === "name"}
            style={{
              width: "100%",
              padding: "13px 16px",
              borderRadius: 14,
              background: step === "name" ? "rgba(255,255,255,0.03)" : "rgba(255,255,255,0.05)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: step === "name" ? "#475569" : "#E2E8F0",
              fontSize: 14,
              fontFamily: "inherit",
              outline: "none",
              boxSizing: "border-box",
            }}
            onFocus={(e) => step === "email" && (e.target.style.borderColor = "rgba(79,70,229,0.6)")}
            onBlur={(e) => (e.target.style.borderColor = "rgba(255,255,255,0.10)")}
          />
        </div>

        <button
          type="submit"
          disabled={!email.trim() || loading}
          style={{
            width: "100%",
            padding: "14px 20px",
            borderRadius: 14,
            background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
            border: "none",
            color: "#fff",
            fontSize: 14,
            fontWeight: 700,
            cursor: email.trim() && !loading ? "pointer" : "not-allowed",
            opacity: email.trim() && !loading ? 1 : 0.5,
            fontFamily: "inherit",
            letterSpacing: "0.01em",
            boxShadow: "0 8px 24px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.2)",
            transition: "all 0.2s",
          }}
          onMouseEnter={(e) => email.trim() && !loading && (e.currentTarget.style.boxShadow = "0 12px 32px rgba(79,70,229,0.55), inset 0 1px 0 rgba(255,255,255,0.2)")}
          onMouseLeave={(e) => (e.currentTarget.style.boxShadow = "0 8px 24px rgba(79,70,229,0.4), inset 0 1px 0 rgba(255,255,255,0.2)")}
        >
          {loading ? "Entrando..." : step === "email" ? "Continuar →" : "Entrar a FlowTime"}
        </button>
      </form>

      {step === "name" && (
        <button
          onClick={() => setStep("email")}
          style={{ background: "none", border: "none", color: "#475569", fontSize: 12, cursor: "pointer", fontFamily: "inherit" }}
        >
          ← Volver
        </button>
      )}

      {error && <p style={{ color: "#F43F5E", fontSize: 12, textAlign: "center", margin: 0 }}>{error}</p>}

      <p style={{ color: "#1E293B", fontSize: 11, textAlign: "center", margin: 0 }}>
        Al continuar aceptas los términos de uso · FlowTime v0.1
      </p>
    </div>
  );
}
