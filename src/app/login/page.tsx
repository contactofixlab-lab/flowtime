import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import LoginForm from "./LoginForm";

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect("/dashboard");

  const googleEnabled = !!(
    process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET
  );

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px 16px",
        background: "#0A0A1A",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Aurora background */}
      <div style={{ position: "absolute", inset: 0, zIndex: 0, pointerEvents: "none" }}>
        {/* Blob 1 — indigo */}
        <div style={{
          position: "absolute",
          top: "-15%",
          left: "-10%",
          width: "70%",
          height: "70%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(79,70,229,0.22) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "float1 8s ease-in-out infinite",
        }} />
        {/* Blob 2 — violet */}
        <div style={{
          position: "absolute",
          bottom: "-20%",
          right: "-15%",
          width: "65%",
          height: "65%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(124,58,237,0.18) 0%, transparent 70%)",
          filter: "blur(60px)",
          animation: "float2 10s ease-in-out infinite",
        }} />
        {/* Blob 3 — cyan accent */}
        <div style={{
          position: "absolute",
          top: "55%",
          left: "30%",
          width: "40%",
          height: "40%",
          borderRadius: "50%",
          background: "radial-gradient(circle, rgba(14,165,233,0.08) 0%, transparent 70%)",
          filter: "blur(50px)",
          animation: "float3 12s ease-in-out infinite",
        }} />
      </div>

      {/* Grid overlay */}
      <div style={{
        position: "absolute",
        inset: 0,
        zIndex: 0,
        backgroundImage: "linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)",
        backgroundSize: "60px 60px",
        maskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
        WebkitMaskImage: "radial-gradient(ellipse 80% 80% at 50% 50%, black 30%, transparent 100%)",
      }} />

      <style>{`
        @keyframes float1 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, 20px) scale(1.05); }
          66% { transform: translate(-20px, 10px) scale(0.95); }
        }
        @keyframes float2 {
          0%, 100% { transform: translate(0, 0) scale(1); }
          40% { transform: translate(-25px, -30px) scale(1.08); }
          70% { transform: translate(15px, 20px) scale(0.96); }
        }
        @keyframes float3 {
          0%, 100% { transform: translate(0, 0); }
          50% { transform: translate(-20px, -25px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        @keyframes shimmer {
          0%, 100% { opacity: 0.6; }
          50% { opacity: 1; }
        }
      `}</style>

      {/* Card */}
      <div
        style={{
          position: "relative",
          zIndex: 1,
          width: "100%",
          maxWidth: 400,
          animation: "fadeUp 0.6s ease both",
        }}
      >
        {/* Logo + heading */}
        <div style={{ textAlign: "center", marginBottom: 36 }}>
          {/* Logo mark */}
          <div style={{
            display: "inline-flex",
            alignItems: "center",
            justifyContent: "center",
            width: 64,
            height: 64,
            borderRadius: 20,
            background: "linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)",
            boxShadow: "0 0 0 1px rgba(255,255,255,0.12), 0 16px 40px rgba(79,70,229,0.5)",
            marginBottom: 20,
            animation: "shimmer 3s ease-in-out infinite",
          }}>
            <svg width="32" height="32" viewBox="0 0 32 32" fill="none">
              <path d="M8 24 L16 8 L24 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 19 L21 19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="16" cy="8" r="2" fill="white"/>
            </svg>
          </div>
          <h1 style={{
            fontSize: 32,
            fontWeight: 800,
            color: "#F1F5F9",
            margin: "0 0 6px",
            letterSpacing: "-0.02em",
          }}>
            FlowTime
          </h1>
          <p style={{ color: "#475569", fontSize: 14, margin: 0 }}>
            Organiza tu tiempo, sin fricción
          </p>

          {/* Decorative line */}
          <div style={{
            margin: "20px auto 0",
            width: 40,
            height: 2,
            borderRadius: 2,
            background: "linear-gradient(90deg, #4F46E5, #7C3AED)",
            opacity: 0.6,
          }} />
        </div>

        <LoginForm googleEnabled={googleEnabled} />

        {/* Bottom badges */}
        <div style={{ display: "flex", justifyContent: "center", gap: 16, marginTop: 20 }}>
          {["Next.js 16", "Neon DB", "Telegram"].map((t) => (
            <span
              key={t}
              style={{
                fontSize: 10,
                color: "#334155",
                padding: "3px 8px",
                borderRadius: 6,
                border: "1px solid rgba(255,255,255,0.05)",
                background: "rgba(255,255,255,0.02)",
              }}
            >
              {t}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
}
