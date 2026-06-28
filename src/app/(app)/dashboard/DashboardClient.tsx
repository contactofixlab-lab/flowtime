"use client";

import { Task, Event } from "@prisma/client";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle2, Clock, Zap, CalendarDays } from "lucide-react";
import Link from "next/link";

type Props = {
  user: { name?: string | null; image?: string | null };
  todayTasks: Task[];
  pendingCount: number;
  completedToday: number;
  upcomingEvents: Event[];
};

const PRIORITY_COLOR: Record<string, string> = {
  URGENT: "#F43F5E",
  HIGH: "#F59E0B",
  MEDIUM: "#4F46E5",
  LOW: "#64748B",
};
const PRIORITY_LABEL: Record<string, string> = {
  URGENT: "Urgente",
  HIGH: "Alta",
  MEDIUM: "Media",
  LOW: "Baja",
};
const STATUS_DONE = new Set(["COMPLETED", "CANCELLED"]);

export default function DashboardClient({
  user,
  todayTasks,
  pendingCount,
  completedToday,
  upcomingEvents,
}: Props) {
  const greeting = (() => {
    const h = new Date().getHours();
    if (h < 12) return "Buenos días";
    if (h < 19) return "Buenas tardes";
    return "Buenas noches";
  })();

  const firstName = user.name?.split(" ")[0] ?? "Usuario";

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="text-sm" style={{ color: "#64748B" }}>
            {format(new Date(), "EEEE d 'de' MMMM", { locale: es })}
          </p>
          <h1 className="text-2xl font-black mt-0.5" style={{ color: "#E2E8F0" }}>
            {greeting}, {firstName} 👋
          </h1>
        </div>
        {user.image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={user.image} alt="" className="w-10 h-10 rounded-full" />
        ) : (
          <div
            className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
            style={{ background: "linear-gradient(135deg,#4F46E5,#7C3AED)" }}
          >
            {firstName[0]}
          </div>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        {[
          {
            icon: <Clock size={18} />,
            value: pendingCount,
            label: "Pendientes",
            color: "#4F46E5",
          },
          {
            icon: <CheckCircle2 size={18} />,
            value: completedToday,
            label: "Hoy",
            color: "#10B981",
          },
          {
            icon: <Zap size={18} />,
            value: todayTasks.filter((t) => t.priority === "URGENT").length,
            label: "Urgentes",
            color: "#F43F5E",
          },
        ].map(({ icon, value, label, color }) => (
          <div
            key={label}
            className="glass-card p-4 flex flex-col items-center gap-1"
          >
            <span style={{ color }}>{icon}</span>
            <span className="text-2xl font-black" style={{ color: "#E2E8F0" }}>
              {value}
            </span>
            <span className="text-xs" style={{ color: "#64748B" }}>
              {label}
            </span>
          </div>
        ))}
      </div>

      {/* Today tasks */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-base font-bold" style={{ color: "#E2E8F0" }}>
            Para hoy
          </h2>
          <Link href="/tasks" className="text-xs" style={{ color: "#818CF8" }}>
            Ver todas →
          </Link>
        </div>

        {todayTasks.length === 0 ? (
          <div className="glass-card p-6 text-center">
            <p className="text-2xl mb-1">🎉</p>
            <p className="text-sm" style={{ color: "#64748B" }}>
              No hay tareas para hoy
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {todayTasks.map((task) => (
              <div
                key={task.id}
                className="glass-card px-4 py-3 flex items-center gap-3"
                style={{
                  borderLeft: `3px solid ${PRIORITY_COLOR[task.priority]}`,
                  borderRadius: "14px",
                  opacity: STATUS_DONE.has(task.status) ? 0.5 : 1,
                }}
              >
                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium truncate"
                    style={{
                      color: "#E2E8F0",
                      textDecoration: task.status === "COMPLETED" ? "line-through" : "none",
                    }}
                  >
                    {task.title}
                  </p>
                  {task.dueDate && (
                    <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                      {format(new Date(task.dueDate), "HH:mm")}
                    </p>
                  )}
                </div>
                <span
                  className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                  style={{
                    background: `${PRIORITY_COLOR[task.priority]}22`,
                    color: PRIORITY_COLOR[task.priority],
                  }}
                >
                  {PRIORITY_LABEL[task.priority]}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Upcoming events */}
      {upcomingEvents.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-base font-bold" style={{ color: "#E2E8F0" }}>
              Próximos eventos
            </h2>
            <Link href="/calendar" className="text-xs" style={{ color: "#818CF8" }}>
              Calendario →
            </Link>
          </div>
          <div className="flex flex-col gap-2">
            {upcomingEvents.map((ev) => (
              <div
                key={ev.id}
                className="glass-card px-4 py-3 flex items-center gap-3"
              >
                <CalendarDays size={16} style={{ color: ev.color ?? "#4F46E5", flexShrink: 0 }} />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium truncate" style={{ color: "#E2E8F0" }}>
                    {ev.title}
                  </p>
                  <p className="text-xs mt-0.5" style={{ color: "#475569" }}>
                    {format(new Date(ev.startDate), "d MMM · HH:mm", { locale: es })}
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
