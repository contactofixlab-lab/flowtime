import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format, subDays, startOfDay } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle2, Flame, TrendingUp, Trophy } from "lucide-react";

export default async function HistoryPage() {
  const session = await auth();
  const userId = session!.user!.id!;

  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [completedThisMonth, completedToday, allCompleted] = await Promise.all([
    prisma.task.count({
      where: { userId, status: "COMPLETED", completedAt: { gte: monthStart } },
    }),
    prisma.task.count({
      where: {
        userId,
        status: "COMPLETED",
        completedAt: { gte: startOfDay(now) },
      },
    }),
    prisma.task.findMany({
      where: { userId, status: "COMPLETED" },
      orderBy: { completedAt: "desc" },
      take: 30,
    }),
  ]);

  const avgPerDay =
    completedThisMonth > 0
      ? (completedThisMonth / now.getDate()).toFixed(1)
      : "0";

  // Simple streak: consecutive days with at least 1 task completed
  let streak = 0;
  let d = startOfDay(now);
  while (true) {
    const count = allCompleted.filter(
      (t) =>
        t.completedAt &&
        startOfDay(new Date(t.completedAt)).getTime() === d.getTime()
    ).length;
    if (count === 0) break;
    streak++;
    d = subDays(d, 1);
  }

  const byPriority = allCompleted.reduce<Record<string, number>>((acc, t) => {
    acc[t.priority] = (acc[t.priority] ?? 0) + 1;
    return acc;
  }, {});

  const stats = [
    { icon: CheckCircle2, value: completedThisMonth, label: "Este mes", color: "#10B981" },
    { icon: TrendingUp, value: avgPerDay, label: "Prom./día", color: "#4F46E5" },
    { icon: Flame, value: streak, label: "Racha actual", color: "#F59E0B" },
    { icon: Trophy, value: completedToday, label: "Hoy", color: "#F43F5E" },
  ];

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

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8">
      <h1 className="text-2xl font-black mb-5" style={{ color: "#E2E8F0" }}>
        Historial
      </h1>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {stats.map(({ icon: Icon, value, label, color }) => (
          <div key={label} className="glass-card p-4 flex items-center gap-3">
            <div
              className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}1a` }}
            >
              <Icon size={20} style={{ color }} />
            </div>
            <div>
              <p className="text-2xl font-black" style={{ color: "#E2E8F0" }}>
                {value}
              </p>
              <p className="text-xs" style={{ color: "#64748B" }}>
                {label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* Priority distribution */}
      {Object.keys(byPriority).length > 0 && (
        <div className="glass-card p-4 mb-6">
          <h2 className="text-sm font-bold mb-3" style={{ color: "#E2E8F0" }}>
            Por prioridad
          </h2>
          <div className="flex flex-col gap-2">
            {(["URGENT", "HIGH", "MEDIUM", "LOW"] as const).map((p) => {
              const count = byPriority[p] ?? 0;
              const pct = allCompleted.length > 0 ? (count / allCompleted.length) * 100 : 0;
              return (
                <div key={p} className="flex items-center gap-3">
                  <span className="text-xs w-14 text-right" style={{ color: PRIORITY_COLOR[p] }}>
                    {PRIORITY_LABEL[p]}
                  </span>
                  <div
                    className="flex-1 h-2 rounded-full"
                    style={{ background: "rgba(255,255,255,0.06)" }}
                  >
                    <div
                      className="h-2 rounded-full transition-all"
                      style={{ width: `${pct}%`, background: PRIORITY_COLOR[p] }}
                    />
                  </div>
                  <span className="text-xs w-6" style={{ color: "#64748B" }}>
                    {count}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Completed list */}
      <h2 className="text-base font-bold mb-3" style={{ color: "#E2E8F0" }}>
        Completadas recientes
      </h2>
      {allCompleted.length === 0 ? (
        <div className="glass-card p-8 text-center">
          <p className="text-3xl mb-2">🚀</p>
          <p className="text-sm" style={{ color: "#64748B" }}>
            Aún no hay tareas completadas
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          {allCompleted.map((task) => (
            <div
              key={task.id}
              className="glass-card px-4 py-3 flex items-center gap-3"
              style={{ borderLeft: `3px solid ${PRIORITY_COLOR[task.priority]}`, borderRadius: 14 }}
            >
              <CheckCircle2 size={18} style={{ color: "#10B981", flexShrink: 0 }} />
              <div className="flex-1 min-w-0">
                <p
                  className="text-sm font-medium truncate"
                  style={{ color: "#94A3B8", textDecoration: "line-through" }}
                >
                  {task.title}
                </p>
                <p className="text-[10px] mt-0.5" style={{ color: "#475569" }}>
                  {task.completedAt
                    ? format(new Date(task.completedAt), "d MMM · HH:mm", { locale: es })
                    : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
