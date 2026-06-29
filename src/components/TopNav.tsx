"use client";

import { useState } from "react";
import NewTaskModal from "./NewTaskModal";

type Props = {
  user: { name?: string | null; image?: string | null };
};

export default function TopNav({ user }: Props) {
  const [modal, setModal] = useState(false);
  const firstName = user.name?.split(" ")[0] ?? "U";

  return (
    <>
      <header style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: 60, display: "flex", alignItems: "center",
        padding: "0 24px", gap: 16,
        background: "rgba(8,8,22,0.85)",
        borderBottom: "1px solid rgba(255,255,255,0.05)",
        backdropFilter: "blur(20px)",
      }} className="topnav-desktop">

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 12px rgba(79,70,229,0.4)",
          }}>
            <svg width="16" height="16" viewBox="0 0 32 32" fill="none">
              <path d="M8 24 L16 8 L24 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 19 L21 19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="16" cy="8" r="2" fill="white"/>
            </svg>
          </div>
          <span style={{ color: "#E2E8F0", fontSize: 16, fontWeight: 800, letterSpacing: "-0.02em" }}>FlowTime</span>
        </div>

        {/* Search bar — centro */}
        <div style={{ flex: 1, maxWidth: 420, margin: "0 auto" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 8,
            height: 34, padding: "0 14px", borderRadius: 17,
            background: "rgba(255,255,255,0.05)",
            border: "1px solid rgba(255,255,255,0.08)",
          }}>
            <span style={{ fontSize: 13, opacity: 0.6 }}>🔍</span>
            <span style={{ color: "#334155", fontSize: 13, flex: 1 }}>Buscar tareas, eventos...</span>
            <span style={{ color: "#334155", fontSize: 10, background: "rgba(255,255,255,0.06)", padding: "2px 6px", borderRadius: 4 }}>⌘K</span>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: "flex", alignItems: "center", gap: 10, flexShrink: 0 }}>
          {/* Notificaciones */}
          <div style={{ position: "relative" }}>
            <div style={{
              width: 36, height: 34, borderRadius: 10, cursor: "pointer",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.07)",
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 15,
            }}>🔔</div>
            <div style={{
              position: "absolute", top: -4, right: -4, width: 16, height: 16, borderRadius: "50%",
              background: "#F43F5E", display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 8, fontWeight: 700, color: "#fff",
            }}>2</div>
          </div>

          {/* Nueva tarea */}
          <button
            onClick={() => setModal(true)}
            style={{
              padding: "0 18px", height: 34, borderRadius: 10,
              background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
              border: "none", color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", gap: 6,
              boxShadow: "0 4px 12px rgba(79,70,229,0.35)",
            }}
          >
            <span style={{ fontSize: 16, lineHeight: 1 }}>+</span> Nueva tarea
          </button>

          {/* Avatar */}
          {user.image ? (
            <img src={user.image} alt="" style={{ width: 34, height: 34, borderRadius: "50%", border: "2px solid rgba(79,70,229,0.4)", cursor: "pointer" }} />
          ) : (
            <div style={{
              width: 34, height: 34, borderRadius: "50%",
              background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
              display: "flex", alignItems: "center", justifyContent: "center",
              fontSize: 13, fontWeight: 800, color: "#fff",
              border: "2px solid rgba(79,70,229,0.4)", cursor: "pointer",
            }}>{firstName[0]}</div>
          )}
        </div>
      </header>

      {modal && <NewTaskModal onClose={() => setModal(false)} />}

      <style>{`
        .topnav-desktop { display: none; }
        @media (min-width: 1024px) {
          .topnav-desktop { display: flex; }
        }
      `}</style>
    </>
  );
}
