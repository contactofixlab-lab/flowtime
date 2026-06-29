import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format, subDays, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

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

export default async function HistoryPage() {
  const session = await auth();
  const userId = session!.user!.id!;
  const now = new Date();
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

  const [completedThisMonth, completedToday, allCompleted] = await Promise.all([
    prisma.task.count({ where: { userId, status: "COMPLETED", completedAt: { gte: monthStart } } }),
    prisma.task.count({ where: { userId, status: "COMPLETED", completedAt: { gte: startOfDay(now) } } }),
    prisma.task.findMany({ where: { userId, status: "COMPLETED" }, orderBy: { completedAt: "desc" }, take: 30 }),
  ]);

  const avgPerDay = completedThisMonth > 0 ? (completedThisMonth / now.getDate()).toFixed(1) : "0";

  let streak = 0;
  let d = startOfDay(now);
  while (true) {
    const count = allCompleted.filter(t => t.completedAt && startOfDay(new Date(t.completedAt)).getTime() === d.getTime()).length;
    if (count === 0) break;
    streak++;
    d = subDays(d, 1);
  }

  const byPriority = allCompleted.reduce<Record<string, number>>((acc, t) => {
    acc[t.priority] = (acc[t.priority] ?? 0) + 1;
    return acc;
  }, {});

  const stats = [
    { value: completedThisMonth, label: "Este mes", color: "#10B981", icon: "✅" },
    { value: avgPerDay, label: "Prom./día", color: "#4F46E5", icon: "📈" },
    { value: streak, label: "Racha", color: "#F59E0B", icon: "🔥" },
    { value: completedToday, label: "Hoy", color: "#F43F5E", icon: "🏆" },
  ];

  return (
    <div className="page-layout" style={{ padding: "24px 16px 0" }}>
      <style>{`
        .page-layout { max-width: 560px; margin: 0 auto; }
        @media (min-width: 1024px) { .page-layout { max-width: 720px; padding: 40px 48px !important; } }
      `}</style>

      {/* Header */}
      <h1 style={{ color: "#F1F5F9", fontSize: 22, fontWeight: 800, margin: "0 0 20px", letterSpacing: "-0.02em" }}>
        Historial
      </h1>

      {/* Stats 2x2 */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
        {stats.map(s => (
          <div key={s.label} style={{ ...card, borderRadius: 16, padding: "16px 14px", display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 40, height: 40, borderRadius: 12, flexShrink: 0,
              background: `${s.color}18`,
              display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20,
            }}>{s.icon}</div>
            <div>
              <p style={{ color: "#F1F5F9", fontSize: 24, fontWeight: 800, margin: 0, lineHeight: 1 }}>{s.value}</p>
              <p style={{ color: "#475569", fontSize: 11, margin: "3px 0 0", fontWeight: 600 }}>{s.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Por prioridad */}
      {Object.keys(byPriority).length > 0 && (
        <div style={{ ...card, borderRadius: 16, padding: "16px 14px", marginBottom: 20 }}>
          <h2 style={{ color: "#E2E8F0", fontSize: 13, fontWeight: 700, margin: "0 0 14px" }}>Por prioridad</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {(["URGENT", "HIGH", "MEDIUM", "LOW"] as const).map(p => {
              const count = byPriority[p] ?? 0;
              const pct = allCompleted.length > 0 ? (count / allCompleted.length) * 100 : 0;
              return (
                <div key={p} style={{ display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ color: PRIORITY_COLOR[p], fontSize: 11, fontWeight: 700, width: 52, textAlign: "right" }}>
                    {PRIORITY_LABEL[p]}
                  </span>
                  <div style={{ flex: 1, height: 6, borderRadius: 3, background: "rgba(255,255,255,0.06)" }}>
                    <div style={{ width: `${pct}%`, height: 6, borderRadius: 3, background: PRIORITY_COLOR[p], transition: "width 0.4s" }} />
                  </div>
                  <span style={{ color: "#475569", fontSize: 11, width: 20 }}>{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Lista completadas */}
      <h2 style={{ color: "#64748B", fontSize: 11, fontWeight: 700, margin: "0 0 10px", letterSpacing: "0.05em", textTransform: "uppercase" }}>
        Completadas recientes
      </h2>
      {allCompleted.length === 0 ? (
        <div style={{ ...card, padding: "40px 20px", textAlign: "center" }}>
          <p style={{ fontSize: 32, marginBottom: 8 }}>🚀</p>
          <p style={{ color: "#475569", fontSize: 13, margin: 0 }}>Aún no hay tareas completadas</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {allCompleted.map(task => (
            <div key={task.id} style={{
              ...card, borderRadius: 14,
              borderLeft: `3px solid ${PRIORITY_COLOR[task.priority]}`,
              padding: "12px 14px", display: "flex", alignItems: "center", gap: 12,
            }}>
              <span style={{ color: "#10B981", fontSize: 16, flexShrink: 0 }}>✓</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "#64748B", fontSize: 13, fontWeight: 500, margin: "0 0 2px", textDecoration: "line-through", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                  {task.title}
                </p>
                <p style={{ color: "#334155", fontSize: 10, margin: 0 }}>
                  {task.completedAt ? format(new Date(task.completedAt), "d MMM · HH:mm", { locale: es }) : ""}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
