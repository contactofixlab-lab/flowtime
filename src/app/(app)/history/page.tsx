import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { format, subDays, startOfDay } from "date-fns";
import { es } from "date-fns/locale";

const PRIORITY_COLOR: Record<string, string> = {
  URGENT: "#F43F5E", HIGH: "#F59E0B", MEDIUM: "#4F46E5", LOW: "#64748B",
};
const PRIORITY_LABEL: Record<string, string> = {
  URGENT: "URGENTE", HIGH: "ALTA", MEDIUM: "MEDIA", LOW: "BAJA",
};
const PRIORITY_BADGE_BG: Record<string, string> = {
  URGENT: "rgba(244,63,94,0.2)", HIGH: "rgba(245,158,11,0.2)",
  MEDIUM: "rgba(79,70,229,0.2)", LOW: "rgba(100,116,139,0.2)",
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
    { value: completedThisMonth, label: "Completadas este mes", color: "#10B981", borderColor: "rgba(16,185,129,0.28)", bg: "rgba(16,185,129,0.22)", icon: "✅" },
    { value: avgPerDay, label: "Promedio diario", color: "#818CF8", borderColor: "rgba(79,70,229,0.28)", bg: "rgba(79,70,229,0.22)", icon: "📊" },
    { value: streak, label: "Días racha actual", color: "#FBBF24", borderColor: "rgba(245,158,11,0.28)", bg: "rgba(245,158,11,0.22)", icon: "🔥" },
    { value: completedToday, label: "Completadas hoy", color: "#FB7185", borderColor: "rgba(244,63,94,0.28)", bg: "rgba(244,63,94,0.22)", icon: "🏆" },
  ];

  const priorities = ["URGENT", "HIGH", "MEDIUM", "LOW"] as const;

  return (
    <>
      {/* Mobile */}
      <div className="hist-mobile" style={{ padding: "24px 16px 0" }}>
        <h1 style={{ color: "#F1F5F9", fontSize: 22, fontWeight: 800, margin: "0 0 20px" }}>Historial</h1>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginBottom: 20 }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: "14px", display: "flex", alignItems: "center", gap: 10 }}>
              <div style={{ width: 38, height: 38, borderRadius: 10, background: s.bg + "40", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
              <div>
                <p style={{ color: "#F1F5F9", fontSize: 22, fontWeight: 800, margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: "#475569", fontSize: 10, margin: "3px 0 0" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {allCompleted.map(task => (
            <div key={task.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: "3px solid " + PRIORITY_COLOR[task.priority], borderRadius: 14, padding: "12px 14px", display: "flex", alignItems: "center", gap: 10 }}>
              <span style={{ color: "#10B981", fontSize: 14, flexShrink: 0 }}>✓</span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ color: "#64748B", fontSize: 13, margin: "0 0 1px", textDecoration: "line-through", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</p>
                <p style={{ color: "#334155", fontSize: 10, margin: 0 }}>{task.completedAt ? format(new Date(task.completedAt), "d MMM · HH:mm", { locale: es }) : ""}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Desktop */}
      <div className="hist-desktop" style={{ padding: "32px 48px 0" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h1 style={{ color: "#F1F5F9", fontSize: 28, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.03em" }}>Historial</h1>
            <p style={{ color: "#64748B", fontSize: 12, margin: 0 }}>{completedThisMonth} tareas completadas este mes</p>
          </div>
          <div style={{ display: "flex", gap: 10 }}>
            <div style={{ padding: "0 16px", height: 34, display: "flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 10 }}>
              <span style={{ color: "#64748B", fontSize: 12 }}>📅 {format(now, "MMMM yyyy", { locale: es })}</span>
              <span style={{ color: "#818CF8", fontSize: 12 }}>▼</span>
            </div>
            <div style={{ padding: "0 20px", height: 34, display: "flex", alignItems: "center", background: "linear-gradient(135deg,#4F46E5,#7C3AED)", borderRadius: 10, fontSize: 12, fontWeight: 600, color: "#fff" }}>
              Exportar CSV
            </div>
          </div>
        </div>

        {/* Stats 4 en fila */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4,1fr)", gap: 16, marginBottom: 24 }}>
          {stats.map(s => (
            <div key={s.label} style={{
              background: `linear-gradient(135deg, ${s.bg}, ${s.bg.replace("0.22", "0.08")})`,
              border: `1px solid ${s.borderColor}`, borderRadius: 18, padding: "20px",
              display: "flex", alignItems: "center", gap: 14,
            }}>
              <span style={{ fontSize: 24 }}>{s.icon}</span>
              <div>
                <p style={{ color: "#E2E8F0", fontSize: 40, fontWeight: 800, margin: 0, lineHeight: 1 }}>{s.value}</p>
                <p style={{ color: "#64748B", fontSize: 12, margin: "4px 0 0" }}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* 2 columnas: gráfico + distribución */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 440px", gap: 20, marginBottom: 24 }}>
          {/* Gráfico evolución semanal */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
              <h2 style={{ color: "#E2E8F0", fontSize: 15, fontWeight: 700, margin: 0 }}>Evolución semanal</h2>
              <span style={{ color: "#818CF8", fontSize: 11 }}>últimas 6 semanas</span>
            </div>
            {/* SVG chart */}
            <svg viewBox="0 0 640 140" style={{ width: "100%", height: "auto" }}>
              {/* Grid lines */}
              {[0,1,2,3].map(i => (
                <line key={i} x1="40" y1={20 + i*32} x2="620" y2={20 + i*32} stroke="rgba(255,255,255,0.04)" strokeWidth="1"/>
              ))}
              {/* Area */}
              <polygon points="60,104 164,76 268,90 372,46 476,62 580,24 580,125 60,125" fill="rgba(79,70,229,0.15)"/>
              {/* Line */}
              <polyline points="60,104 164,76 268,90 372,46 476,62 580,24" fill="none" stroke="#4F46E5" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round"/>
              {/* Dots */}
              {[[60,104],[164,76],[268,90],[372,46],[476,62],[580,24]].map(([x,y], i) => (
                <circle key={i} cx={x} cy={y} r={i === 5 ? 6 : 4} fill={i === 5 ? "#7C3AED" : "#4F46E5"} stroke={i === 5 ? "rgba(124,58,237,0.3)" : "none"} strokeWidth={i === 5 ? 10 : 0}/>
              ))}
              {/* X labels */}
              {["S1","S2","S3","S4","S5","Hoy"].map((l, i) => (
                <text key={l} x={60 + i*104} y={138} textAnchor="middle" fill={i === 5 ? "#4F46E5" : "#64748B"} fontSize="10" fontWeight={i === 5 ? "700" : "400"}>{l}</text>
              ))}
              {/* Y labels */}
              {["10","7","4","1"].map((l, i) => (
                <text key={l} x={34} y={24 + i*32} textAnchor="end" fill="#475569" fontSize="9">{l}</text>
              ))}
            </svg>
          </div>

          {/* Distribución por prioridad */}
          <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.07)", borderRadius: 18, padding: "24px" }}>
            <h2 style={{ color: "#E2E8F0", fontSize: 15, fontWeight: 700, margin: "0 0 20px" }}>Por prioridad</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              {priorities.map(p => {
                const count = byPriority[p] ?? 0;
                const pct = allCompleted.length > 0 ? Math.round((count / allCompleted.length) * 100) : 0;
                const barPct = allCompleted.length > 0 ? (count / allCompleted.length) * 270 : 0;
                return (
                  <div key={p}>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ color: "#64748B", fontSize: 11 }}>{PRIORITY_LABEL[p]}</span>
                      <span style={{ color: "#475569", fontSize: 11 }}>{count} ({pct}%)</span>
                    </div>
                    <div style={{ height: 22, borderRadius: 6, background: "rgba(255,255,255,0.05)", overflow: "hidden" }}>
                      <div style={{ width: barPct, height: 22, background: PRIORITY_COLOR[p], borderRadius: 6, opacity: 0.8, display: "flex", alignItems: "center", paddingLeft: 8 }}>
                        {count > 0 && <span style={{ color: "#fff", fontSize: 10, fontWeight: 700, whiteSpace: "nowrap" }}>{count} ({pct}%)</span>}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Tabla completadas */}
        <div>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <h2 style={{ color: "#E2E8F0", fontSize: 15, fontWeight: 700, margin: 0 }}>Últimas completadas</h2>
            <span style={{ color: "#818CF8", fontSize: 12 }}>Ver todas →</span>
          </div>
          {/* Header tabla */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 100px 100px 150px 100px", background: "rgba(255,255,255,0.03)", borderRadius: 8, padding: "10px 20px", marginBottom: 4 }}>
            {["TAREA","PRIORIDAD","ETIQUETA","COMPLETADA","DURACIÓN"].map(h => (
              <span key={h} style={{ color: "#475569", fontSize: 11, fontWeight: 600 }}>{h}</span>
            ))}
          </div>
          {allCompleted.length === 0 ? (
            <div style={{ background: "rgba(255,255,255,0.03)", border: "1px solid rgba(255,255,255,0.06)", borderRadius: 10, padding: "32px", textAlign: "center", color: "#334155", fontSize: 13 }}>
              Aún no hay tareas completadas
            </div>
          ) : (
            allCompleted.map((task, i) => (
              <div key={task.id} style={{
                display: "grid", gridTemplateColumns: "1fr 100px 100px 150px 100px",
                background: i % 2 === 0 ? "rgba(255,255,255,0.025)" : "rgba(255,255,255,0.015)",
                border: i % 2 === 0 ? "1px solid rgba(255,255,255,0.05)" : "none",
                borderRadius: 10, padding: "12px 20px", marginBottom: 2, alignItems: "center",
              }}>
                <div style={{ display: "flex", alignItems: "center", gap: 10, minWidth: 0 }}>
                  <div style={{ width: 24, height: 24, borderRadius: "50%", background: "rgba(16,185,129,0.3)", border: "1.5px solid #10B981", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <span style={{ color: "#34D399", fontSize: 11 }}>✓</span>
                  </div>
                  <span style={{ color: "#94A3B8", fontSize: 13, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{task.title}</span>
                </div>
                <div>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 9, background: PRIORITY_BADGE_BG[task.priority], color: PRIORITY_COLOR[task.priority], fontWeight: 700 }}>
                    {PRIORITY_LABEL[task.priority]}
                  </span>
                </div>
                <div>
                  <span style={{ fontSize: 10, padding: "2px 8px", borderRadius: 9, background: "rgba(79,70,229,0.15)", color: "#818CF8" }}>—</span>
                </div>
                <span style={{ color: "#64748B", fontSize: 12 }}>
                  {task.completedAt ? format(new Date(task.completedAt), "d MMM · HH:mm", { locale: es }) : "—"}
                </span>
                <span style={{ color: "#64748B", fontSize: 12 }}>—</span>
              </div>
            ))
          )}
        </div>
      </div>

      <style>{`
        .hist-mobile  { display: block; }
        .hist-desktop { display: none; }
        @media (min-width: 1024px) {
          .hist-mobile  { display: none; }
          .hist-desktop { display: block; }
        }
      `}</style>
    </>
  );
}
