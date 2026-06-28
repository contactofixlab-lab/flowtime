"use client";

import { useState } from "react";
import { X, Calendar, Tag, Bell } from "lucide-react";

type Props = { onClose: () => void; onCreated?: () => void };

const PRIORITIES = [
  { value: "LOW", label: "Baja", color: "#64748B" },
  { value: "MEDIUM", label: "Media", color: "#818CF8" },
  { value: "HIGH", label: "Alta", color: "#FBBF24" },
  { value: "URGENT", label: "Urgente", color: "#F43F5E" },
];

export default function NewTaskModal({ onClose, onCreated }: Props) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState("MEDIUM");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, priority, dueDate: dueDate || null }),
      });
      if (!res.ok) throw new Error("Error al crear la tarea");
      onCreated?.();
      onClose();
    } catch {
      setError("No se pudo crear la tarea. Intenta de nuevo.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-end md:items-center justify-center"
      style={{ background: "rgba(0,0,0,0.7)", backdropFilter: "blur(6px)" }}
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div
        className="w-full md:max-w-lg mx-4 rounded-t-3xl md:rounded-2xl p-6"
        style={{
          background: "linear-gradient(180deg, #141428, #0F0F22)",
          border: "1px solid rgba(255,255,255,0.09)",
          boxShadow: "0 -8px 40px rgba(0,0,0,0.6)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-xl font-bold" style={{ color: "#E2E8F0" }}>
            Nueva Tarea
          </h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl flex items-center justify-center transition-colors hover:bg-white/10"
            style={{ color: "#64748B" }}
          >
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {/* Title */}
          <input
            type="text"
            placeholder="¿Qué necesitas hacer?"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            autoFocus
            className="w-full px-4 py-3 rounded-xl text-base font-medium placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 transition"
            style={{
              background: "rgba(255,255,255,0.06)",
              border: "1px solid rgba(255,255,255,0.10)",
              color: "#E2E8F0",
            }}
          />

          {/* Description */}
          <textarea
            placeholder="Descripción (opcional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={2}
            className="w-full px-4 py-3 rounded-xl text-sm resize-none placeholder:text-slate-600 focus:ring-2 focus:ring-indigo-500/50 transition"
            style={{
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.08)",
              color: "#94A3B8",
            }}
          />

          {/* Priority */}
          <div>
            <p className="text-xs font-semibold mb-2 tracking-wider" style={{ color: "#64748B" }}>
              PRIORIDAD
            </p>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setPriority(p.value)}
                  className="flex-1 py-2 rounded-xl text-xs font-semibold transition-all"
                  style={{
                    background:
                      priority === p.value ? `${p.color}28` : "rgba(255,255,255,0.04)",
                    border:
                      priority === p.value
                        ? `1.5px solid ${p.color}`
                        : "1px solid rgba(255,255,255,0.07)",
                    color: priority === p.value ? p.color : "#475569",
                  }}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>

          {/* Due date */}
          <div className="flex items-center gap-3">
            <Calendar size={16} style={{ color: "#64748B" }} />
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="flex-1 py-2 px-3 rounded-xl text-sm"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.08)",
                color: dueDate ? "#E2E8F0" : "#475569",
              }}
            />
          </div>

          {error && <p className="text-xs text-red-400">{error}</p>}

          {/* Buttons */}
          <div className="flex gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-3 rounded-xl text-sm font-semibold transition-colors hover:bg-white/10"
              style={{ color: "#64748B", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={!title.trim() || loading}
              className="flex-1 py-3 rounded-xl text-sm font-bold text-white transition-all disabled:opacity-50 hover:brightness-110"
              style={{
                background: "linear-gradient(135deg, #4F46E5, #7C3AED)",
                boxShadow: "0 4px 16px rgba(79,70,229,0.4)",
              }}
            >
              {loading ? "Creando..." : "Crear tarea"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
