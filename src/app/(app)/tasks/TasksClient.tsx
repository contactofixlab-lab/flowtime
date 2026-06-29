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
const PRIORITY_LABEL: Record<string, string> = {
  URGENT: "Urgente", HIGH: "Alta", MEDIUM: "Media", LOW: "Baja",
};

const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "PENDING", label: "Pendientes" },
  { key: "IN_PROGRESS", label: "En curso" },
  { key: "COMPLETED", label: "✓ Hechas" },
];

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 16,
  backdropFilter: "blur(16px)",
};

export default function TasksClient({ initialTasks }: { initialTasks: TaskWithTags[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const filtered = filter === "all" ? tasks : tasks.filter(t => t.status === filter);
  const pending = tasks.filter(t => t.status === "PENDING").length;

  const refresh = useCallback(async () => {
    const res = await fetch("/api/tasks");
    if (res.ok) setTasks(await res.json());
  }, []);

  async function toggleDone(task: TaskWithTags) {
    const newStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    setTasks(prev => prev.map(t => t.id === task.id ? { ...t, status: newStatus as Task["status"] } : t));
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  async function deleteTask(id: string) {
    setDeleting(id);
    setTasks(prev => prev.filter(t => t.id !== id));
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
    setDeleting(null);
  }

  return (
    <>
      <div style={{ padding: "32px" }} className="tasks-layout">
        {/* Header */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 28 }}>
          <div>
            <h1 style={{ color: "#F1F5F9", fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: "-0.03em" }}>Mis Tareas</h1>
            {pending > 0 && (
              <p style={{ color: "#475569", fontSize: 13, margin: "4px 0 0" }}>{pending} pendiente{pending !== 1 ? "s" : ""}</p>
            )}
          </div>
          <button
            onClick={() => setShowModal(true)}
            style={{
              padding: "10px 20px", borderRadius: 12, display: "flex", alignItems: "center", gap: 8,
              background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
              border: "none", color: "#fff", fontSize: 13, fontWeight: 700,
              cursor: "pointer", fontFamily: "inherit",
              boxShadow: "0 4px 16px rgba(79,70,229,0.4)",
            }}
          >
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Nueva tarea
          </button>
        </div>

        {/* Filtros */}
        <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
          {FILTERS.map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                padding: "8px 16px", borderRadius: 20, fontSize: 13, fontWeight: 600,
                cursor: "pointer", fontFamily: "inherit", transition: "all 0.15s",
                background: filter === f.key ? "#4F46E5" : "rgba(255,255,255,0.05)",
                color: filter === f.key ? "#fff" : "#64748B",
                border: filter === f.key ? "1px solid #4F46E5" : "1px solid rgba(255,255,255,0.08)",
              }}
            >{f.label}</button>
          ))}
          <span style={{ marginLeft: "auto", color: "#334155", fontSize: 12, alignSelf: "center" }}>
            {filtered.length} tarea{filtered.length !== 1 ? "s" : ""}
          </span>
        </div>

        {/* Lista */}
        {filtered.length === 0 ? (
          <div style={{ ...card, padding: "64px 20px", textAlign: "center" }}>
            <p style={{ fontSize: 40, marginBottom: 12 }}>✅</p>
            <p style={{ color: "#475569", fontSize: 15, margin: "0 0 20px" }}>No hay tareas aquí</p>
            <button
              onClick={() => setShowModal(true)}
              style={{
                padding: "11px 24px", borderRadius: 12, fontSize: 14, fontWeight: 700,
                background: "linear-gradient(135deg,#4F46E5,#7C3AED)", border: "none",
                color: "#fff", cursor: "pointer", fontFamily: "inherit",
              }}
            >+ Nueva tarea</button>
          </div>
        ) : (
          <div className="tasks-grid">
            {filtered.map(task => (
              <div
                key={task.id}
                style={{
                  ...card, borderRadius: 16,
                  borderLeft: `3px solid ${PRIORITY_COLOR[task.priority]}`,
                  padding: "16px",
                  display: "flex", alignItems: "flex-start", gap: 12,
                  opacity: deleting === task.id ? 0.4 : 1,
                  transition: "opacity 0.2s",
                }}
              >
                {/* Checkbox */}
                <button
                  onClick={() => toggleDone(task)}
                  style={{
                    flexShrink: 0, marginTop: 2,
                    width: 22, height: 22, borderRadius: 8,
                    border: task.status === "COMPLETED" ? "none" : "2px solid rgba(255,255,255,0.15)",
                    background: task.status === "COMPLETED" ? "#10B981" : "rgba(255,255,255,0.04)",
                    display: "flex", alignItems: "center", justifyContent: "center",
                    cursor: "pointer", color: "#fff", fontSize: 12, fontWeight: 700,
                  }}
                >{task.status === "COMPLETED" ? "✓" : ""}</button>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{
                    color: task.status === "COMPLETED" ? "#475569" : "#E2E8F0",
                    fontSize: 14, fontWeight: 600, margin: "0 0 6px",
                    textDecoration: task.status === "COMPLETED" ? "line-through" : "none",
                    overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                  }}>{task.title}</p>
                  {task.description && (
                    <p style={{ color: "#475569", fontSize: 12, margin: "0 0 8px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                      {task.description}
                    </p>
                  )}
                  <div style={{ display: "flex", alignItems: "center", gap: 6, flexWrap: "wrap" }}>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: "2px 8px", borderRadius: 20,
                      background: `${PRIORITY_COLOR[task.priority]}20`, color: PRIORITY_COLOR[task.priority],
                    }}>{PRIORITY_LABEL[task.priority]}</span>
                    {task.dueDate && (
                      <span style={{ color: "#475569", fontSize: 11 }}>
                        📅 {format(new Date(task.dueDate), "d MMM · HH:mm", { locale: es })}
                      </span>
                    )}
                    {task.tags.map(tag => (
                      <span key={tag.id} style={{
                        fontSize: 10, padding: "2px 7px", borderRadius: 20,
                        background: `${tag.color}20`, color: tag.color, border: `1px solid ${tag.color}40`,
                      }}>{tag.name}</span>
                    ))}
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteTask(task.id)}
                  style={{
                    flexShrink: 0, background: "none", border: "none", cursor: "pointer",
                    color: "#334155", padding: 4, fontSize: 15, lineHeight: 1, opacity: 0.6,
                  }}
                >🗑</button>
              </div>
            ))}
          </div>
        )}
      </div>

      <style>{`
        .tasks-layout {
          max-width: 600px;
          margin: 0 auto;
        }
        .tasks-grid {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        @media (min-width: 1024px) {
          .tasks-layout {
            max-width: 1200px;
            padding: 40px 48px !important;
          }
          .tasks-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 12px;
          }
        }
      `}</style>

      {showModal && <NewTaskModal onClose={() => setShowModal(false)} onCreated={refresh} />}
    </>
  );
}
