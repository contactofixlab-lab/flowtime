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
    { value: completedToday, label: "Completadas hoy", color: "#10B981", bg: "rgba(16,185,129,0.12)", icon: "✅" },
    { value: todayTasks.filter(t => t.priority === "URGENT").length, label: "Urgentes", color: "#F43F5E", bg: "rgba(244,63,94,0.12)", icon: "🔥" },
    { value: upcomingEvents.length, label: "Eventos próximos", color: "#F59E0B", bg: "rgba(245,158,11,0.12)", icon: "📅" },
  ];

  return (
    <div style={{ padding: "32px 32px" }} className="dashboard-layout">
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 32 }}>
        <div>
          <p style={{ color: "#334155", fontSize: 13, margin: "0 0 4px", fontWeight: 500 }}>
            {format(new Date(), "EEEE d 'de' MMMM, yyyy", { locale: es })}
          </p>
          <h1 style={{ color: "#F1F5F9", fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: "-0.03em" }}>
            {greeting}, {firstName} 👋
          </h1>
        </div>
        {user.image ? (
          <img src={user.image} alt="" style={{ width: 48, height: 48, borderRadius: "50%", border: "2px solid rgba(79,70,229,0.4)" }} />
        ) : (
          <div style={{
            width: 48, height: 48, borderRadius: "50%",
            background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 18, fontWeight: 800, color: "#fff",
            border: "2px solid rgba(79,70,229,0.4)",
          }}>{firstName[0]}</div>
        )}
      </div>

      {/* Stats */}
      <div className="stats-grid" style={{ marginBottom: 32 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...card, padding: "20px", display: "flex", alignItems: "center", gap: 16 }}>
            <div style={{ width: 48, height: 48, borderRadius: 14, background: s.bg, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
              {s.icon}
            </div>
            <div>
              <span style={{ color: "#F1F5F9", fontSize: 32, fontWeight: 800, lineHeight: 1, display: "block" }}>{s.value}</span>
              <span style={{ color: "#475569", fontSize: 12, fontWeight: 500 }}>{s.label}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Columnas */}
      <div className="dashboard-cols">
        {/* Tareas de hoy */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ color: "#E2E8F0", fontSize: 16, fontWeight: 700, margin: 0 }}>Para hoy</h2>
            <Link href="/tasks" style={{ color: "#818CF8", fontSize: 13, textDecoration: "none" }}>Ver todas →</Link>
          </div>
          {todayTasks.length === 0 ? (
            <div style={{ ...card, padding: "40px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>🎉</p>
              <p style={{ color: "#475569", fontSize: 14, margin: 0 }}>Sin tareas para hoy</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {todayTasks.map(task => (
                <div key={task.id} style={{
                  ...card, borderRadius: 14,
                  borderLeft: `3px solid ${PRIORITY_COLOR[task.priority]}`,
                  padding: "14px 16px", display: "flex", alignItems: "center", gap: 12,
                  opacity: task.status === "COMPLETED" ? 0.5 : 1,
                }}>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{
                      color: "#E2E8F0", fontSize: 14, fontWeight: 600, margin: "0 0 4px",
                      textDecoration: task.status === "COMPLETED" ? "line-through" : "none",
                      overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                    }}>{task.title}</p>
                    {task.dueDate && (
                      <p style={{ color: "#475569", fontSize: 12, margin: 0 }}>
                        🕐 {format(new Date(task.dueDate), "HH:mm")}
                      </p>
                    )}
                  </div>
                  <span style={{
                    fontSize: 10, fontWeight: 700, padding: "3px 10px", borderRadius: 20,
                    background: `${PRIORITY_COLOR[task.priority]}20`,
                    color: PRIORITY_COLOR[task.priority], whiteSpace: "nowrap",
                  }}>{PRIORITY_LABEL[task.priority]}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Eventos próximos */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
            <h2 style={{ color: "#E2E8F0", fontSize: 16, fontWeight: 700, margin: 0 }}>Eventos próximos</h2>
            <Link href="/calendar" style={{ color: "#818CF8", fontSize: 13, textDecoration: "none" }}>Calendario →</Link>
          </div>
          {upcomingEvents.length === 0 ? (
            <div style={{ ...card, padding: "40px 20px", textAlign: "center" }}>
              <p style={{ fontSize: 32, marginBottom: 8 }}>📭</p>
              <p style={{ color: "#475569", fontSize: 14, margin: 0 }}>Sin eventos próximos</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {upcomingEvents.map(ev => (
                <div key={ev.id} style={{
                  ...card, borderRadius: 14,
                  borderLeft: `3px solid ${ev.color ?? "#10B981"}`,
                  padding: "14px 16px",
                }}>
                  <p style={{ color: "#E2E8F0", fontSize: 14, fontWeight: 600, margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</p>
                  <p style={{ color: "#475569", fontSize: 12, margin: 0 }}>
                    📅 {format(new Date(ev.startDate), "d MMM · HH:mm", { locale: es })}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <style>{`
        .dashboard-layout {
          max-width: 600px;
          margin: 0 auto;
        }
        .stats-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
        }
        .dashboard-cols {
          display: flex;
          flex-direction: column;
          gap: 32px;
        }
        @media (min-width: 1024px) {
          .dashboard-layout {
            max-width: 1200px;
            padding: 40px 48px !important;
          }
          .stats-grid {
            grid-template-columns: repeat(4, 1fr);
          }
          .dashboard-cols {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
        }
      `}</style>
    </div>
  );
}
