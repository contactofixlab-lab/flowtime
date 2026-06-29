"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import {
  LayoutDashboard, CheckSquare, Calendar, History, Settings, LogOut, Plus,
} from "lucide-react";
import { useState } from "react";
import NewTaskModal from "./NewTaskModal";

const nav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/tasks", icon: CheckSquare, label: "Tareas" },
  { href: "/calendar", icon: Calendar, label: "Calendario" },
  { href: "/history", icon: History, label: "Historial" },
  { href: "/settings", icon: Settings, label: "Configuración" },
];

type Props = {
  user: { name?: string | null; email?: string | null; image?: string | null };
};

export default function Sidebar({ user }: Props) {
  const pathname = usePathname();
  const [modal, setModal] = useState(false);
  const isActive = (href: string) => pathname.startsWith(href);
  const firstName = user.name?.split(" ")[0] ?? "Usuario";

  return (
    <>
      <aside style={{
        position: "fixed", top: 0, left: 0, bottom: 0, width: 240, zIndex: 50,
        background: "rgba(10,10,26,0.85)",
        borderRight: "1px solid rgba(255,255,255,0.07)",
        backdropFilter: "blur(24px)",
        display: "flex", flexDirection: "column",
        padding: "24px 0",
      }} className="sidebar-desktop">

        {/* Logo */}
        <div style={{ padding: "0 20px 28px", display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{
            width: 36, height: 36, borderRadius: 10,
            background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
            display: "flex", alignItems: "center", justifyContent: "center",
            boxShadow: "0 4px 16px rgba(79,70,229,0.4)",
            flexShrink: 0,
          }}>
            <svg width="18" height="18" viewBox="0 0 32 32" fill="none">
              <path d="M8 24 L16 8 L24 24" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
              <path d="M11 19 L21 19" stroke="white" strokeWidth="2.5" strokeLinecap="round"/>
              <circle cx="16" cy="8" r="2" fill="white"/>
            </svg>
          </div>
          <span style={{ color: "#F1F5F9", fontSize: 17, fontWeight: 800, letterSpacing: "-0.02em" }}>FlowTime</span>
        </div>

        {/* Nueva tarea */}
        <div style={{ padding: "0 16px 20px" }}>
          <button
            onClick={() => setModal(true)}
            style={{
              width: "100%", padding: "10px 16px", borderRadius: 12,
              background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
              border: "none", color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
              boxShadow: "0 4px 16px rgba(79,70,229,0.35)",
            }}
          >
            <Plus size={16} strokeWidth={2.5} />
            Nueva tarea
          </button>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "0 16px 16px" }} />

        {/* Nav links */}
        <nav style={{ flex: 1, display: "flex", flexDirection: "column", gap: 2, padding: "0 12px" }}>
          {nav.map(({ href, icon: Icon, label }) => {
            const active = isActive(href);
            return (
              <Link
                key={href}
                href={href}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "10px 12px", borderRadius: 10, textDecoration: "none",
                  background: active ? "rgba(79,70,229,0.15)" : "transparent",
                  border: active ? "1px solid rgba(79,70,229,0.25)" : "1px solid transparent",
                  transition: "all 0.15s",
                }}
                onMouseEnter={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "rgba(255,255,255,0.04)"; }}
                onMouseLeave={e => { if (!active) (e.currentTarget as HTMLAnchorElement).style.background = "transparent"; }}
              >
                <Icon size={18} strokeWidth={active ? 2.5 : 1.8} color={active ? "#818CF8" : "#475569"} />
                <span style={{ color: active ? "#C7D2FE" : "#475569", fontSize: 13, fontWeight: active ? 600 : 400 }}>
                  {label}
                </span>
                {active && (
                  <div style={{
                    marginLeft: "auto", width: 6, height: 6, borderRadius: "50%",
                    background: "#818CF8",
                  }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Divider */}
        <div style={{ height: 1, background: "rgba(255,255,255,0.06)", margin: "16px 16px 16px" }} />

        {/* User profile */}
        <div style={{ padding: "0 16px" }}>
          <div style={{
            display: "flex", alignItems: "center", gap: 10,
            padding: "10px 12px", borderRadius: 10,
            background: "rgba(255,255,255,0.03)",
            border: "1px solid rgba(255,255,255,0.06)",
          }}>
            {user.image ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={user.image} alt="" style={{ width: 32, height: 32, borderRadius: "50%", flexShrink: 0 }} />
            ) : (
              <div style={{
                width: 32, height: 32, borderRadius: "50%", flexShrink: 0,
                background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: 13, fontWeight: 700, color: "#fff",
              }}>{firstName[0]}</div>
            )}
            <div style={{ flex: 1, minWidth: 0 }}>
              <p style={{ color: "#E2E8F0", fontSize: 12, fontWeight: 600, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{firstName}</p>
              <p style={{ color: "#334155", fontSize: 10, margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{user.email}</p>
            </div>
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              style={{ background: "none", border: "none", cursor: "pointer", padding: 4, flexShrink: 0 }}
              title="Cerrar sesión"
            >
              <LogOut size={14} color="#334155" />
            </button>
          </div>
        </div>
      </aside>

      {modal && <NewTaskModal onClose={() => setModal(false)} />}

      <style>{`
        .sidebar-desktop {
          display: none;
        }
        @media (min-width: 1024px) {
          .sidebar-desktop {
            display: flex;
          }
        }
      `}</style>
    </>
  );
}
