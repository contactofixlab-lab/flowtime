"use client";

import { Task, Tag } from "@prisma/client";
import { useState, useCallback } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import NewTaskModal from "@/components/NewTaskModal";

type TaskWithTags = Task & { tags: Tag[] };

const PRIORITY_COLOR: Record<string, string> = {
  URGENT: "#F43F5E", HIGH: "#F59E0B", MEDIUM: "#4F46E5", LOW: "#64748B",
};
const PRIORITY_BG: Record<string, string> = {
  URGENT: "rgba(244,63,94,0.09)", HIGH: "rgba(245,158,11,0.08)",
  MEDIUM: "rgba(79,70,229,0.07)", LOW: "rgba(255,255,255,0.02)",
};
const PRIORITY_BORDER: Record<string, string> = {
  URGENT: "rgba(244,63,94,0.22)", HIGH: "rgba(245,158,11,0.2)",
  MEDIUM: "rgba(79,70,229,0.18)", LOW: "rgba(255,255,255,0.05)",
};
const PRIORITY_LABEL: Record<string, string> = {
  URGENT: "🔴 URGENTE", HIGH: "🟠 ALTA", MEDIUM: "🔵 MEDIA", LOW: "⚪ BAJA",
};
const PRIORITY_TEXT_COLOR: Record<string, string> = {
  URGENT: "#FB7185", HIGH: "#FBBF24", MEDIUM: "#818CF8", LOW: "#64748B",
};

const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "URGENT", label: "🔴 Urgentes", type: "priority" },
  { key: "today", label: "📅 Hoy" },
  { key: "IN_PROGRESS", label: "▶ En progreso", type: "status" },
  { key: "COMPLETED", label: "✅ Completadas", type: "status" },
];

const card = (priority: string): React.CSSProperties => ({
  background: PRIORITY_BG[priority],
  border: `1px solid ${PRIORITY_BORDER[priority]}`,
  borderLeft: `4px solid ${PRIORITY_COLOR[priority]}`,
  borderRadius: 16,
  backdropFilter: "blur(12px)",
});

export default function TasksClient({ initialTasks }: { initialTasks: TaskWithTags[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/tasks");
    if (res.ok) setTasks(await res.json());
  }, []);

  const getFiltered = () => {
    if (filter === "all") return tasks;
    if (filter === "today") {
      const today = new Date().toDateString();
      return tasks.filter(t => t.dueDate && new Date(t.dueDate).toDateString() === today);
    }
    if (filter === "URGENT") return tasks.filter(t => t.priority === "URGENT");
    return tasks.filter(t => t.status === filter);
  };

  const filtered = getFiltered();

  async function toggleDone(task: TaskWithTags) {
    const newStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus as Task["status"] } : t));
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH", headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  async function deleteTask(id: string) {
    setTasks(prev => prev.filter(t => t.id !== id));
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  }

  const byPriority = (p: string) => filtered.filter(t => t.priority === p);

  const TaskCard = ({ task }: { task: TaskWithTags }) => (
    <div style={{ ...card(task.priority), padding: "14px 16px", marginBottom: 8 }}>
      <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
        <button
          onClick={() => toggleDone(task)}
          style={{
            flexShrink: 0, marginTop: 2, width: 22, height: 22, borderRadius: 8,
            border: task.status === "COMPLETED" ? "none" : `1.5px solid ${PRIORITY_COLOR[task.priority]}50`,
            background: task.status === "COMPLETED" ? "#10B981" : task.status === "IN_PROGRESS" ? "rgba(14,165,233,0.2)" : "transparent",
            cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
            color: "#fff", fontSize: 11,
          }}
        >{task.status === "COMPLETED" ? "✓" : task.status === "IN_PROGRESS" ? "▶" : ""}</button>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{
            color: task.status === "COMPLETED" ? "#475569" : "#E2E8F0",
            fontSize: 13, fontWeight: 600, margin: "0 0 4px",
            textDecoration: task.status === "COMPLETED" ? "line-through" : "none",
            overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
          }}>{task.title}</p>
          {task.status === "IN_PROGRESS" ? (
            <p style={{ color: "#0EA5E9", fontSize: 11, margin: "0 0 4px" }}>En progreso</p>
          ) : task.dueDate ? (
            <p style={{ color: "#64748B", fontSize: 11, margin: "0 0 4px" }}>
              Vence {format(new Date(task.dueDate), "d MMM · HH:mm", { locale: es })}
            </p>
          ) : (
            <p style={{ color: "#374151", fontSize: 11, margin: "0 0 4px" }}>Sin fecha</p>
          )}
          <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
            {task.tags.map(tag => (
              <span key={tag.id} style={{
                fontSize: 9, padding: "2px 8px", borderRadius: 8,
                background: `${tag.color}20`, color: tag.color,
              }}>{tag.name}</span>
            ))}
          </div>
        </div>
        <button onClick={() => deleteTask(task.id)} style={{ background: "none", border: "none", cursor: "pointer", color: "#334155", fontSize: 16, padding: 2, flexShrink: 0 }}>···</button>
      </div>
    </div>
  );

  const pending = tasks.filter(t => t.status === "PENDING").length;
  const urgent = tasks.filter(t => t.priority === "URGENT").length;
  const inProgress = tasks.filter(t => t.status === "IN_PROGRESS").length;

  return (
    <>
      {/* Mobile layout */}
      <div className="tasks-mobile" style={{ padding: "24px 16px 0" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
          <h1 style={{ color: "#F1F5F9", fontSize: 22, fontWeight: 800, margin: 0 }}>Mis Tareas</h1>
          <button onClick={() => setShowModal(true)} style={{
            width: 36, height: 36, borderRadius: 10, background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
            border: "none", color: "#fff", fontSize: 20, cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center",
          }}>+</button>
        </div>
        <div style={{ display: "flex", gap: 8, overflowX: "auto", paddingBottom: 4, marginBottom: 16 }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              whiteSpace: "nowrap", padding: "6px 12px", borderRadius: 20, fontSize: 11, fontWeight: 600,
              cursor: "pointer", fontFamily: "inherit",
              background: filter === f.key ? "#4F46E5" : "rgba(255,255,255,0.05)",
              color: filter === f.key ? "#fff" : "#64748B",
              border: filter === f.key ? "1px solid #4F46E5" : "1px solid rgba(255,255,255,0.08)",
            }}>{f.label}</button>
          ))}
        </div>
        <div>
          {filtered.map(t => <TaskCard key={t.id} task={t} />)}
          {filtered.length === 0 && (
            <div style={{ textAlign: "center", padding: "40px 20px", color: "#334155", fontSize: 13 }}>Sin tareas</div>
          )}
        </div>
      </div>

      {/* Desktop layout — 3 columns by priority */}
      <div className="tasks-desktop" style={{ padding: "32px 48px 0" }}>
        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", marginBottom: 16 }}>
          <div>
            <h1 style={{ color: "#F1F5F9", fontSize: 28, fontWeight: 800, margin: "0 0 4px", letterSpacing: "-0.03em" }}>Mis Tareas</h1>
            <p style={{ color: "#64748B", fontSize: 12, margin: 0 }}>
              {pending} tareas activas · {urgent} urgentes · {inProgress} en progreso
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div style={{ display: "flex", alignItems: "center", marginBottom: 0, gap: 8 }}>
          {FILTERS.map(f => (
            <button key={f.key} onClick={() => setFilter(f.key)} style={{
              padding: "7px 16px", borderRadius: 14, fontSize: 11, fontWeight: filter === f.key ? 700 : 400,
              cursor: "pointer", fontFamily: "inherit",
              background: filter === f.key ? "linear-gradient(135deg,#4F46E5,#7C3AED)" : filter === "URGENT" && f.key === "URGENT" ? "rgba(244,63,94,0.14)" : "rgba(255,255,255,0.05)",
              color: filter === f.key ? "#fff" : f.key === "URGENT" ? "#FB7185" : "#64748B",
              border: filter === f.key ? "none" : f.key === "URGENT" ? "1px solid rgba(244,63,94,0.3)" : "1px solid rgba(255,255,255,0.08)",
            }}>{f.label}</button>
          ))}
          <div style={{ marginLeft: "auto", display: "flex", gap: 8 }}>
            <div style={{
              padding: "7px 16px", borderRadius: 14, fontSize: 11, color: "#64748B",
              background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)",
            }}>↕ Prioridad</div>
            <div style={{
              width: 32, height: 32, borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(79,70,229,0.25)", border: "1px solid rgba(79,70,229,0.4)", fontSize: 14, color: "#818CF8",
            }}>☰</div>
          </div>
        </div>

        <div style={{ height: 1, background: "rgba(255,255,255,0.05)", margin: "16px 0 20px" }} />

        {/* 3 columnas */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3,1fr)", gap: 24 }}>
          {/* Col 1: URGENTE */}
          <div>
            <p style={{ color: "#FB7185", fontSize: 12, fontWeight: 700, letterSpacing: 1, margin: "0 0 12px" }}>
              🔴 URGENTE · {byPriority("URGENT").length}
            </p>
            {byPriority("URGENT").map(t => <TaskCard key={t.id} task={t} />)}
            {byPriority("URGENT").length === 0 && (
              <div style={{ border: "1px dashed rgba(244,63,94,0.2)", borderRadius: 16, padding: "24px", textAlign: "center", color: "#374151", fontSize: 12 }}>Sin tareas urgentes</div>
            )}
          </div>

          {/* Col 2: ALTA */}
          <div>
            <p style={{ color: "#FBBF24", fontSize: 12, fontWeight: 700, letterSpacing: 1, margin: "0 0 12px" }}>
              🟠 ALTA · {byPriority("HIGH").length}
            </p>
            {byPriority("HIGH").map(t => <TaskCard key={t.id} task={t} />)}
            {byPriority("HIGH").length === 0 && (
              <div style={{ border: "1px dashed rgba(245,158,11,0.2)", borderRadius: 16, padding: "24px", textAlign: "center", color: "#374151", fontSize: 12 }}>Sin tareas de prioridad alta</div>
            )}
          </div>

          {/* Col 3: MEDIA + BAJA */}
          <div>
            <p style={{ color: "#818CF8", fontSize: 12, fontWeight: 700, letterSpacing: 1, margin: "0 0 12px" }}>
              🔵 MEDIA · {byPriority("MEDIUM").length}
            </p>
            {byPriority("MEDIUM").map(t => <TaskCard key={t.id} task={t} />)}
            {byPriority("LOW").length > 0 && (
              <>
                <p style={{ color: "#64748B", fontSize: 12, fontWeight: 700, letterSpacing: 1, margin: "16px 0 12px" }}>
                  ⚪ BAJA · {byPriority("LOW").length}
                </p>
                {byPriority("LOW").map(t => <TaskCard key={t.id} task={t} />)}
              </>
            )}
            {byPriority("MEDIUM").length === 0 && byPriority("LOW").length === 0 && (
              <div style={{ border: "1px dashed rgba(79,70,229,0.2)", borderRadius: 16, padding: "24px", textAlign: "center", color: "#374151", fontSize: 12 }}>Sin tareas</div>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .tasks-mobile  { display: block; }
        .tasks-desktop { display: none; }
        @media (min-width: 1024px) {
          .tasks-mobile  { display: none; }
          .tasks-desktop { display: block; }
        }
      `}</style>

      {showModal && <NewTaskModal onClose={() => setShowModal(false)} onCreated={refresh} />}
    </>
  );
}
