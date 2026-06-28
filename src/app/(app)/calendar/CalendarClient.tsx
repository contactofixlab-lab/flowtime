"use client";

import { Event, Task } from "@prisma/client";
import { useState } from "react";
import {
  format,
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  getDay,
} from "date-fns";
import { es } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";

type Props = { events: Event[]; tasks: Task[] };

const PRIORITY_COLOR: Record<string, string> = {
  URGENT: "#F43F5E",
  HIGH: "#F59E0B",
  MEDIUM: "#4F46E5",
  LOW: "#64748B",
};

export default function CalendarClient({ events, tasks }: Props) {
  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState<Date | null>(new Date());

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad start (lunes = 0)
  const startPad = (getDay(monthStart) + 6) % 7;

  const eventsForDay = (d: Date) =>
    events.filter((e) => isSameDay(new Date(e.startDate), d));
  const tasksForDay = (d: Date) =>
    tasks.filter((t) => t.dueDate && isSameDay(new Date(t.dueDate), d));

  const selectedEvents = selected ? eventsForDay(selected) : [];
  const selectedTasks = selected ? tasksForDay(selected) : [];

  return (
    <div className="max-w-2xl mx-auto px-4 pt-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h1 className="text-2xl font-black" style={{ color: "#E2E8F0" }}>
          {format(current, "MMMM yyyy", { locale: es }).replace(/^\w/, (c) => c.toUpperCase())}
        </h1>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrent((d) => subMonths(d, 1))}
            className="w-9 h-9 rounded-xl flex items-center justify-center glass-card transition hover:bg-white/10"
          >
            <ChevronLeft size={18} style={{ color: "#94A3B8" }} />
          </button>
          <button
            onClick={() => setCurrent(new Date())}
            className="px-3 h-9 rounded-xl text-xs font-semibold glass-card transition hover:bg-white/10"
            style={{ color: "#818CF8" }}
          >
            Hoy
          </button>
          <button
            onClick={() => setCurrent((d) => addMonths(d, 1))}
            className="w-9 h-9 rounded-xl flex items-center justify-center glass-card transition hover:bg-white/10"
          >
            <ChevronRight size={18} style={{ color: "#94A3B8" }} />
          </button>
        </div>
      </div>

      {/* Day names */}
      <div className="grid grid-cols-7 mb-1">
        {["Lu", "Ma", "Mi", "Ju", "Vi", "Sa", "Do"].map((d) => (
          <div
            key={d}
            className="text-center text-[11px] font-semibold py-1"
            style={{ color: "#475569" }}
          >
            {d}
          </div>
        ))}
      </div>

      {/* Grid */}
      <div className="glass-card p-2 mb-5">
        <div className="grid grid-cols-7 gap-0.5">
          {Array.from({ length: startPad }).map((_, i) => (
            <div key={`pad-${i}`} />
          ))}
          {days.map((day) => {
            const hasEvent = eventsForDay(day).length > 0;
            const hasTask = tasksForDay(day).length > 0;
            const sel = selected && isSameDay(day, selected);
            const tod = isToday(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelected(day)}
                className="relative aspect-square flex flex-col items-center justify-center rounded-xl transition-all text-sm font-semibold"
                style={{
                  background: sel
                    ? "linear-gradient(135deg,#4F46E5,#7C3AED)"
                    : tod
                    ? "rgba(79,70,229,0.15)"
                    : "transparent",
                  color: sel ? "#fff" : tod ? "#818CF8" : "#94A3B8",
                }}
              >
                {format(day, "d")}
                {(hasEvent || hasTask) && (
                  <div className="absolute bottom-1 flex gap-0.5">
                    {hasTask && (
                      <span className="w-1 h-1 rounded-full bg-indigo-400" />
                    )}
                    {hasEvent && (
                      <span className="w-1 h-1 rounded-full bg-emerald-400" />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Day detail */}
      {selected && (
        <div>
          <h2 className="text-sm font-bold mb-3" style={{ color: "#94A3B8" }}>
            {format(selected, "EEEE d 'de' MMMM", { locale: es })}
          </h2>

          {selectedTasks.length === 0 && selectedEvents.length === 0 ? (
            <p className="text-sm" style={{ color: "#475569" }}>
              Sin tareas ni eventos para este día
            </p>
          ) : (
            <div className="flex flex-col gap-2">
              {selectedTasks.map((t) => (
                <div
                  key={t.id}
                  className="glass-card px-4 py-3 flex items-center gap-3"
                  style={{ borderLeft: `3px solid ${PRIORITY_COLOR[t.priority]}`, borderRadius: 14 }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "#E2E8F0" }}>
                      {t.title}
                    </p>
                    <p className="text-[10px]" style={{ color: "#475569" }}>
                      Tarea · {t.dueDate ? format(new Date(t.dueDate), "HH:mm") : "Sin hora"}
                    </p>
                  </div>
                </div>
              ))}
              {selectedEvents.map((ev) => (
                <div
                  key={ev.id}
                  className="glass-card px-4 py-3 flex items-center gap-3"
                  style={{ borderLeft: `3px solid ${ev.color ?? "#10B981"}`, borderRadius: 14 }}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate" style={{ color: "#E2E8F0" }}>
                      {ev.title}
                    </p>
                    <p className="text-[10px]" style={{ color: "#475569" }}>
                      Evento · {format(new Date(ev.startDate), "HH:mm")}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
