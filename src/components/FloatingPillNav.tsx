"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, CheckSquare, Plus, Calendar, History, Settings } from "lucide-react";
import { useState } from "react";
import NewTaskModal from "./NewTaskModal";

const mobileNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Inicio" },
  { href: "/tasks", icon: CheckSquare, label: "Tareas" },
  null,
  { href: "/calendar", icon: Calendar, label: "Cal." },
  { href: "/settings", icon: Settings, label: "Config" },
];

const desktopNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Inicio" },
  { href: "/tasks", icon: CheckSquare, label: "Tareas" },
  null,
  { href: "/calendar", icon: Calendar, label: "Calendario" },
  { href: "/history", icon: History, label: "Historial" },
  { href: "/settings", icon: Settings, label: "Config" },
];

export default function FloatingPillNav() {
  const pathname = usePathname();
  const [modal, setModal] = useState(false);
  const isActive = (href: string) => pathname.startsWith(href);

  const NavItem = ({ item, size }: { item: typeof desktopNav[0]; size: "sm" | "lg" }) => {
    if (!item) return null;
    const active = isActive(item.href);
    const px = size === "lg" ? "18px" : "12px";
    return (
      <Link
        href={item.href}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center",
          gap: 3, padding: `8px ${px}`, borderRadius: 18, textDecoration: "none",
          background: active ? "rgba(79,70,229,0.22)" : "transparent",
          border: active ? "1px solid rgba(79,70,229,0.45)" : "1px solid transparent",
          transition: "all 0.15s",
          minWidth: size === "lg" ? 64 : 50,
        }}
      >
        <item.icon size={size === "lg" ? 20 : 19} strokeWidth={active ? 2.5 : 1.8} color={active ? "#818CF8" : "#475569"} />
        <span style={{ fontSize: size === "lg" ? 10 : 9, fontWeight: active ? 700 : 500, color: active ? "#818CF8" : "#475569" }}>
          {item.label}
        </span>
      </Link>
    );
  };

  const FAB = ({ size }: { size: "sm" | "lg" }) => (
    <button
      onClick={() => setModal(true)}
      style={{
        width: size === "lg" ? 52 : 46,
        height: size === "lg" ? 52 : 46,
        borderRadius: "50%",
        background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
        border: "2px solid rgba(255,255,255,0.15)",
        color: "#fff", fontSize: size === "lg" ? 24 : 22,
        cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
        boxShadow: "0 4px 20px rgba(79,70,229,0.55)",
        flexShrink: 0,
        fontFamily: "inherit", lineHeight: 1,
      }}
    >
      <Plus size={size === "lg" ? 22 : 20} strokeWidth={2.5} />
    </button>
  );

  const pillBase: React.CSSProperties = {
    display: "flex", alignItems: "center",
    background: "rgba(13,13,38,0.92)",
    border: "1px solid rgba(255,255,255,0.10)",
    backdropFilter: "blur(24px)",
    boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 60px rgba(79,70,229,0.12)",
    borderRadius: 999,
  };

  return (
    <>
      {/* Mobile pill */}
      <nav style={{ position: "fixed", bottom: 16, left: "50%", transform: "translateX(-50%)", zIndex: 50 }} className="nav-mobile">
        <div style={{ ...pillBase, gap: 4, padding: "6px 8px", height: 60 }}>
          {mobileNav.map((item, i) =>
            item === null
              ? <FAB key="fab" size="sm" />
              : <NavItem key={item.href} item={item} size="sm" />
          )}
        </div>
      </nav>

      {/* Desktop pill — más ancho, 6 ítems */}
      <nav style={{ position: "fixed", bottom: 20, left: "50%", transform: "translateX(-50%)", zIndex: 50 }} className="nav-desktop">
        <div style={{ ...pillBase, gap: 6, padding: "6px 16px", height: 64 }}>
          {/* Glow interior sutil */}
          {desktopNav.map((item, i) =>
            item === null
              ? <FAB key="fab" size="lg" />
              : <NavItem key={item.href} item={item} size="lg" />
          )}
        </div>
      </nav>

      {modal && <NewTaskModal onClose={() => setModal(false)} />}

      <style>{`
        .nav-mobile  { display: flex; }
        .nav-desktop { display: none; }
        @media (min-width: 1024px) {
          .nav-mobile  { display: none; }
          .nav-desktop { display: flex; }
        }
      `}</style>
    </>
  );
}
