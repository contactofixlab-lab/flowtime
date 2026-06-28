"use client";

import { Task, Tag } from "@prisma/client";
import { useState, useCallback } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { CheckCircle2, Circle, Trash2, Clock } from "lucide-react";
import NewTaskModal from "@/components/NewTaskModal";

type TaskWithTags = Task & { tags: Tag[] };

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

const FILTERS = [
  { key: "all", label: "Todas" },
  { key: "PENDING", label: "Pendientes" },
  { key: "IN_PROGRESS", label: "En curso" },
  { key: "COMPLETED", label: "Completadas" },
];

export default function TasksClient({ initialTasks }: { initialTasks: TaskWithTags[] }) {
  const [tasks, setTasks] = useState(initialTasks);
  const [filter, setFilter] = useState("all");
  const [showModal, setShowModal] = useState(false);

  const filtered =
    filter === "all" ? tasks : tasks.filter((t) => t.status === filter);

  const refresh = useCallback(async () => {
    const res = await fetch("/api/tasks");
    if (res.ok) setTasks(await res.json());
  }, []);

  async function toggleDone(task: TaskWithTags) {
    const newStatus = task.status === "COMPLETED" ? "PENDING" : "COMPLETED";
    setTasks((prev) =>
      prev.map((t) => (t.id === task.id ? { ...t, status: newStatus as Task["status"] } : t))
    );
    await fetch(`/api/tasks/${task.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: newStatus }),
    });
  }

  async function deleteTask(id: string) {
    setTasks((prev) => prev.filter((t) => t.id !== id));
    await fetch(`/api/tasks/${id}`, { method: "DELETE" });
  }

  return (
    <>
      <div className="max-w-2xl mx-auto px-4 pt-8">
        <h1 className="text-2xl font-black mb-4" style={{ color: "#E2E8F0" }}>
          Mis Tareas
        </h1>

        {/* Filters */}
        <div className="flex gap-2 mb-5 overflow-x-auto pb-1 scrollbar-hide">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className="whitespace-nowrap px-4 py-1.5 rounded-full text-xs font-semibold transition-all"
              style={{
                background: filter === f.key ? "#4F46E5" : "rgba(255,255,255,0.05)",
                color: filter === f.key ? "#fff" : "#64748B",
                border:
                  filter === f.key
                    ? "1px solid #4F46E5"
                    : "1px solid rgba(255,255,255,0.08)",
              }}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Task list */}
        {filtered.length === 0 ? (
          <div className="glass-card p-8 text-center">
            <p className="text-3xl mb-2">✅</p>
            <p className="text-sm" style={{ color: "#64748B" }}>
              No hay tareas en este estado
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-2">
            {filtered.map((task) => (
              <div
                key={task.id}
                className="glass-card px-4 py-3 flex items-start gap-3 group"
                style={{
                  borderLeft: `3px solid ${PRIORITY_COLOR[task.priority]}`,
                  borderRadius: "14px",
                }}
              >
                {/* Done toggle */}
                <button
                  onClick={() => toggleDone(task)}
                  className="mt-0.5 flex-shrink-0 transition-transform active:scale-90"
                >
                  {task.status === "COMPLETED" ? (
                    <CheckCircle2 size={20} color="#10B981" />
                  ) : (
                    <Circle size={20} color="#475569" />
                  )}
                </button>

                <div className="flex-1 min-w-0">
                  <p
                    className="text-sm font-medium"
                    style={{
                      color: task.status === "COMPLETED" ? "#475569" : "#E2E8F0",
                      textDecoration:
                        task.status === "COMPLETED" ? "line-through" : "none",
                    }}
                  >
                    {task.title}
                  </p>
                  {task.description && (
                    <p className="text-xs mt-0.5 truncate" style={{ color: "#475569" }}>
                      {task.description}
                    </p>
                  )}
                  <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                    <span
                      className="text-[9px] font-bold px-2 py-0.5 rounded-full"
                      style={{
                        background: `${PRIORITY_COLOR[task.priority]}22`,
                        color: PRIORITY_COLOR[task.priority],
                      }}
                    >
                      {PRIORITY_LABEL[task.priority]}
                    </span>
                    {task.dueDate && (
                      <span
                        className="flex items-center gap-1 text-[10px]"
                        style={{ color: "#475569" }}
                      >
                        <Clock size={10} />
                        {format(new Date(task.dueDate), "d MMM HH:mm", { locale: es })}
                      </span>
                    )}
                    {task.tags.map((tag) => (
                      <span
                        key={tag.id}
                        className="text-[9px] px-1.5 py-0.5 rounded-full"
                        style={{
                          background: `${tag.color}22`,
                          color: tag.color,
                          border: `1px solid ${tag.color}44`,
                        }}
                      >
                        {tag.name}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Delete */}
                <button
                  onClick={() => deleteTask(task.id)}
                  className="opacity-0 group-hover:opacity-100 flex-shrink-0 mt-0.5 transition-opacity"
                  style={{ color: "#475569" }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <NewTaskModal onClose={() => setShowModal(false)} onCreated={refresh} />
      )}
    </>
  );
}
