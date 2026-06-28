"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CheckSquare,
  Plus,
  Calendar,
  History,
  Settings,
} from "lucide-react";
import { useState } from "react";
import NewTaskModal from "./NewTaskModal";

const mobileNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Inicio" },
  { href: "/tasks", icon: CheckSquare, label: "Tareas" },
  null, // FAB slot
  { href: "/calendar", icon: Calendar, label: "Calendario" },
  { href: "/settings", icon: Settings, label: "Config" },
];

const desktopNav = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Inicio" },
  { href: "/tasks", icon: CheckSquare, label: "Tareas" },
  null, // FAB slot
  { href: "/calendar", icon: Calendar, label: "Calendario" },
  { href: "/history", icon: History, label: "Historial" },
  { href: "/settings", icon: Settings, label: "Config" },
];

export default function FloatingPillNav() {
  const pathname = usePathname();
  const [modalOpen, setModalOpen] = useState(false);

  const isActive = (href: string) => pathname.startsWith(href);

  return (
    <>
      {/* Mobile pill */}
      <nav className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 md:hidden">
        <div
          className="flex items-center gap-1 px-3 rounded-full"
          style={{
            background: "rgba(13,13,38,0.92)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(20px)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5)",
            height: "60px",
          }}
        >
          {mobileNav.map((item, i) =>
            item === null ? (
              <button
                key="fab"
                onClick={() => setModalOpen(true)}
                className="mx-1 w-12 h-12 rounded-full flex items-center justify-center text-white transition-transform active:scale-95"
                style={{
                  background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                  boxShadow: "0 4px 16px rgba(79,70,229,0.5)",
                }}
              >
                <Plus size={22} strokeWidth={2.5} />
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 px-3 py-1 rounded-2xl transition-colors"
                style={{ minWidth: 52 }}
              >
                <item.icon
                  size={20}
                  strokeWidth={isActive(item.href) ? 2.5 : 1.8}
                  color={isActive(item.href) ? "#818CF8" : "#475569"}
                />
                <span
                  className="text-[9px] font-medium"
                  style={{ color: isActive(item.href) ? "#818CF8" : "#475569" }}
                >
                  {item.label}
                </span>
              </Link>
            )
          )}
        </div>
      </nav>

      {/* Desktop pill */}
      <nav className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50 hidden md:flex">
        <div
          className="flex items-center gap-1 px-4 rounded-full"
          style={{
            background: "rgba(13,13,38,0.92)",
            border: "1px solid rgba(255,255,255,0.10)",
            backdropFilter: "blur(24px)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 60px rgba(79,70,229,0.15)",
            height: "60px",
          }}
        >
          {desktopNav.map((item, i) =>
            item === null ? (
              <button
                key="fab"
                onClick={() => setModalOpen(true)}
                className="mx-2 w-12 h-12 rounded-full flex items-center justify-center text-white transition-transform active:scale-95 hover:scale-110"
                style={{
                  background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                  boxShadow: "0 4px 20px rgba(79,70,229,0.5)",
                }}
              >
                <Plus size={22} strokeWidth={2.5} />
              </button>
            ) : (
              <Link
                key={item.href}
                href={item.href}
                className="flex flex-col items-center gap-0.5 px-4 py-1 rounded-2xl transition-all hover:bg-white/5"
                style={{
                  background: isActive(item.href)
                    ? "rgba(79,70,229,0.2)"
                    : "transparent",
                  border: isActive(item.href)
                    ? "1px solid rgba(79,70,229,0.4)"
                    : "1px solid transparent",
                }}
              >
                <item.icon
                  size={20}
                  strokeWidth={isActive(item.href) ? 2.5 : 1.8}
                  color={isActive(item.href) ? "#818CF8" : "#475569"}
                />
                <span
                  className="text-[9px] font-semibold"
                  style={{ color: isActive(item.href) ? "#818CF8" : "#475569" }}
                >
                  {item.label}
                </span>
              </Link>
            )
          )}
        </div>
      </nav>

      {modalOpen && <NewTaskModal onClose={() => setModalOpen(false)} />}
    </>
  );
}
