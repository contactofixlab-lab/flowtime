"use client";

import { Event, Task } from "@prisma/client";
import { useState } from "react";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameDay, isToday, addMonths, subMonths, getDay,
} from "date-fns";
import { es } from "date-fns/locale";

type Props = { events: Event[]; tasks: Task[] };

const PRIORITY_COLOR: Record<string, string> = {
  URGENT: "#F43F5E", HIGH: "#F59E0B", MEDIUM: "#4F46E5", LOW: "#64748B",
};

const card: React.CSSProperties = {
  background: "rgba(255,255,255,0.04)",
  border: "1px solid rgba(255,255,255,0.08)",
  borderRadius: 18,
  backdropFilter: "blur(16px)",
};

export default function CalendarClient({ events, tasks }: Props) {
  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState<Date>(new Date());

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = (getDay(monthStart) + 6) % 7;

  const eventsForDay = (d: Date) => events.filter(e => isSameDay(new Date(e.startDate), d));
  const tasksForDay = (d: Date) => tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), d));
  const selectedEvents = eventsForDay(selected);
  const selectedTasks = tasksForDay(selected);

  return (
    <div style={{ padding: "24px 16px 0" }} className="cal-wrap">
      <style>{`
        .cal-wrap { max-width: 560px; margin: 0 auto; }
        .cal-inner { display: flex; flex-direction: column; gap: 24px; }
        @media (min-width: 1024px) {
          .cal-wrap { max-width: 100%; padding: 40px 48px 0 !important; }
          .cal-inner { display: grid; grid-template-columns: 1fr 300px; gap: 40px; align-items: start; }
        }
      `}</style>

      <div className="cal-inner">
        {/* Calendaro */}
        <div>
          {/* Header mes */}
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
            <h1 style={{ color: "#F1F5F9", fontSize: 22, fontWeight: 800, margin: 0, letterSpacing: "-0.02em", textTransform: "capitalize" }}>
              {format(current, "MMMM yyyy", { locale: es })}
            </h1>
            <div style={{ display: "flex", gap: 8 }}>
              <button onClick={() => setCurrent(d => subMonths(d, 1))} style={{
                width: 34, height: 34, borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)", color: "#94A3B8", fontSize: 16, cursor: "pointer",
              }}>&#8249;</button>
              <button onClick={() => { setCurrent(new Date()); setSelected(new Date()); }} style={{
                padding: "0 12px", height: 34, borderRadius: 10, border: "1px solid rgba(79,70,229,0.4)",
                background: "rgba(79,70,229,0.12)", color: "#818CF8", fontSize: 12, fontWeight: 700,
                cursor: "pointer", fontFamily: "inherit",
              }}>Hoy</button>
              <button onClick={() => setCurrent(d => addMonths(d, 1))} style={{
                width: 34, height: 34, borderRadius: 10, border: "1px solid rgba(255,255,255,0.08)",
                background: "rgba(255,255,255,0.04)", color: "#94A3B8", fontSize: 16, cursor: "pointer",
              }}>&#8250;</button>
            </div>
          </div>

          {/* Días semana */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 6 }}>
            {["Lu","Ma","Mi","Ju","Vi","Sa","Do"].map(d => (
              <div key={d} style={{ textAlign: "center", color: "#334155", fontSize: 11, fontWeight: 700, padding: "4px 0" }}>{d}</div>
            ))}
          </div>

          {/* Grid */}
          <div style={{ ...card, padding: 8 }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 3 }}>
              {Array.from({ length: startPad }).map((_, i) => <div key={"p" + i} />)}
              {days.map(day => {
                const hasE = eventsForDay(day).length > 0;
                const hasT = tasksForDay(day).length > 0;
                const sel = isSameDay(day, selected);
                const tod = isToday(day);
                return (
                  <button
                    key={day.toISOString()}
                    onClick={() => setSelected(day)}
                    style={{
                      position: "relative", aspectRatio: "1", display: "flex", flexDirection: "column",
                      alignItems: "center", justifyContent: "center", borderRadius: 10, border: "none",
                      cursor: "pointer", fontSize: 13, fontWeight: sel || tod ? 700 : 400, fontFamily: "inherit",
                      background: sel ? "linear-gradient(135deg,#4F46E5,#7C3AED)" : tod ? "rgba(79,70,229,0.15)" : "transparent",
                      color: sel ? "#fff" : tod ? "#818CF8" : "#64748B",
                      boxShadow: sel ? "0 4px 12px rgba(79,70,229,0.4)" : "none",
                    }}
                  >
                    {format(day, "d")}
                    {(hasE || hasT) && (
                      <div style={{ position: "absolute", bottom: 3, display: "flex", gap: 2 }}>
                        {hasT && <span style={{ width: 4, height: 4, borderRadius: "50%", background: sel ? "rgba(255,255,255,0.7)" : "#818CF8" }} />}
                        {hasE && <span style={{ width: 4, height: 4, borderRadius: "50%", background: sel ? "rgba(255,255,255,0.7)" : "#34D399" }} />}
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Detalle */}
        <div>
          <h2 style={{ color: "#64748B", fontSize: 11, fontWeight: 700, margin: "0 0 12px", letterSpacing: "0.06em", textTransform: "uppercase" }}>
            {format(selected, "EEEE d 'de' MMMM", { locale: es })}
          </h2>
          {selectedTasks.length === 0 && selectedEvents.length === 0 ? (
            <div style={{ ...card, padding: "28px 20px", textAlign: "center" }}>
              <p style={{ color: "#334155", fontSize: 13, margin: 0 }}>Sin tareas ni eventos</p>
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              {selectedTasks.map(t => (
                <div key={t.id} style={{ ...card, borderRadius: 14, borderLeft: "3px solid " + PRIORITY_COLOR[t.priority], padding: "12px 14px" }}>
                  <p style={{ color: "#E2E8F0", fontSize: 13, fontWeight: 600, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{t.title}</p>
                  <p style={{ color: "#475569", fontSize: 11, margin: 0 }}>{"📋 " + (t.dueDate ? format(new Date(t.dueDate), "HH:mm") : "Sin hora")}</p>
                </div>
              ))}
              {selectedEvents.map(ev => (
                <div key={ev.id} style={{ ...card, borderRadius: 14, borderLeft: "3px solid " + (ev.color ?? "#10B981"), padding: "12px 14px" }}>
                  <p style={{ color: "#E2E8F0", fontSize: 13, fontWeight: 600, margin: "0 0 2px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{ev.title}</p>
                  <p style={{ color: "#475569", fontSize: 11, margin: 0 }}>{"📅 " + format(new Date(ev.startDate), "HH:mm")}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
