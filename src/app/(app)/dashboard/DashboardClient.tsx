"use client";

import { Task, Event } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import Link from "next/link";

type Props = {
  user: { name?: string | null; image?: string | null };
  todayTasks: Task[];
  pendingCount: number;
  completedToday: number;
  upcomingEvents: Event[];
};

const PRIORITY_COLOR: Record<string, string> = {
  URGENT: "#F43F5E", HIGH: "#F59E0B", MEDIUM: "#4F46E5", LOW: "#64748B",
};
const PRIORITY_LABEL: Record<string, string> = {
  URGENT: "Urgente", HIGH: "Alta", MEDIUM: "Media", LOW: "Baja",
};

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 18,
  backdropFilter: "blur(16px)",
};

export default function DashboardClient({ user, todayTasks, pendingCount, completedToday, upcomingEvents }: Props) {
  const h = new Date().getHours();
  const greeting = h < 12 ? "Buenos días" : h < 19 ? "Buenas tardes" : "Buenas noches";
  const firstName = user.name?.split(" ")[0] ?? "Usuario";

  const stats = [
    { value: pendingCount, label: "Pendientes", color: "#4F46E5", bg: "rgba(79,70,229,0.12)", icon: "⏳" },
    { value: completedToday, label: "Hoy", color: "#10B981", bg: "rgba(16,185,129,0.12)", icon: "✅" },
    { value: todayTasks.filter(t => t.priority === "URGENT").length, label: "Urgentes", color: "#F43F5E", bg: "rgba(244,63,94,0.12)", icon: "🔥" },
  ];

  return (
    <div style={{ maxWidth: 480, margin: "0 auto", padding: "24px 16px 0" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 24 }}>
        <div>
          <p style={{ color: "#475569", fontSize: 12, margin: "0 0 2px", fontWeight: 500 }}>
            {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
          </p>
          <h1 style={{ color: "#F1F5F9", fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.02em" }}>
            {greeting}, {firstName} 👋
          </h1>
        </div>
        {user.image ? (
          <img src={user.image} alt="" style={{ width: 42, height: 42, borderRadius: "50%", border: "2px solid rgba(79,70,229,0.4)" }} />
        ) : (
          <div style={{
            width: 42, height: 42, borderRadius: "50%",
            background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 16, fontWeight: 800, color: "#fff",
            border: "2px solid rgba(79,70,229,0.4)",
          }}>
            {firstName[0]}
          </div>
        )}
      </div>

      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 10, marginBottom: 24 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...card, padding: "16px 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: 4 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, marginBottom: 4 }}>
              {s.icon}
            </div>
            <span style={{ color: "#F1F5F9", fontSize: 26, fontWeight: 800, lineHeight: 1 }}>{s.value}</span>
            <span style={{ color: "#475569", fontSize: 10, fontWeight: 600 }}>{s.label}</span>
          </div>
        ))}
      </div>

      {/* Tareas de hoy */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ color: "#E2E8F0", fontSize: 15, fontWeight: 700, margin: 0 }}>Para hoy</h2>
          <Link href="/tasks" style={{ color: "#818CF8", fontSize: 12, textDecoration: "none" }}>Ver todas →</Link>
        </div>

        {todayTasks.length === 0 ? (
          <div style={{ ...card, padding: "32px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 28, marginBottom: 6 }}>🎉</p>
            <p style={{ color: "#475569", fontSize: 13, margin: 0 }}>Sin tareas para hoy</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {todayTasks.map(task => (
              <div key={task.id} style={{
                ...card,
                borderRadius: 14,
                borderLeft: `3px solid ${PRIORITY_COLOR[task.priority]}`,
                padding: "12px 14px",
                display: "flex",
                alignItems: "center",
                gap: 12,
                opacity: task.status === "COMPLETED" ? 0.5 : 1,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    color: "#E2E8F0", fontSize: 13, fontWeight: 600, margin: "0 0 2px",
                    textDecoration: task.status === "COMPLETED" ? "line-through" : "none",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{task.title}</p>
                  {task.dueDate && (
                    <p style={{ color: "#475569", fontSize: 11, margin: 0 }}>
                      🕐 {format(new Date(task.dueDate), "HH:mm")}
                    </p>
                  )}
                </div>
                <span style={{
                  fontSize: 9, fontWeight: 700, padding: "3px 8px", borderRadius: 20,
                  background: `${PRIORITY_COLOR[task.priority]}20`,
                  color: PRIORITY_COLOR[task.priority], whiteSpace: "nowrap",
                }}>{PRIORITY_LABEL[task.priority]}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Eventos próximos */}
      {upcomingEvents.length > 0 && (
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ color: "#E2E8F0", fontSize: 15, fontWeight: 700, margin: 0 }}>Próximos eventos</h2>
            <Link href="/calendar" style={{ color: "#818CF8", fontSize: 12, textDecoration: "none" }}>Calendario →</Link>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {upcomingEvents.map(ev => (
              <div key={ev.id} style={{
                ...card, borderRadius: 14,
                borderLeft: `3px solid ${ev.color ?? "#10B981"}`,
                padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
              }}>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ color: "#E2E8F0", fontSize: 13, fontWeight: 600, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</p>
                  <p style={{ color: "#475569", fontSize: 11, margin: 0 }}>
                    📅 {format(new Date(ev.startDate), "d MMM · HH:mm", { locale: es })}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
