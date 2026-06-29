"use client";

import { Event, Task } from "@prisma/client";
import { useState } from "react";
import {
  format, startOfMonth, endOfMonth, eachDayOfInterval,
  isSameDay, isToday, addMonths, subMonths, getDay, startOfWeek, endOfWeek,
} from "date-fns";
import { es } from "date-fns/locale";

type Props = { events: Event[]; tasks: Task[] };

const PRIORITY_COLOR: Record<string, string> = {
  URGENT: "#F43F5E", HIGH: "#F59E0B", MEDIUM: "#4F46E5", LOW: "#64748B",
};

export default function CalendarClient({ events, tasks }: Props) {
  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState<Date>(new Date());

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  const startPad = (getDay(monthStart) + 6) % 7; // Mon-start

  const eventsForDay = (d: Date) => events.filter(e => isSameDay(new Date(e.startDate), d));
  const tasksForDay = (d: Date) => tasks.filter(t => t.dueDate && isSameDay(new Date(t.dueDate), d));
  const selectedEvents = eventsForDay(selected);
  const selectedTasks = tasksForDay(selected);

  // Mobile compact calendar
  const MobileCalendar = (
    <div style={{ padding: "24px 16px 0" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
        <h1 style={{ color: "#F1F5F9", fontSize: 22, fontWeight: 800, margin: 0, textTransform: "capitalize" }}>
          {format(current, "MMMM yyyy", { locale: es })}
        </h1>
        <div style={{ display: "flex", gap: 8 }}>
          <button onClick={() => setCurrent(d => subMonths(d, 1))} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#94A3B8", fontSize: 16, cursor: "pointer" }}>&#8249;</button>
          <button onClick={() => { setCurrent(new Date()); setSelected(new Date()); }} style={{ padding: "0 10px", height: 32, borderRadius: 9, border: "1px solid rgba(79,70,229,0.4)", background: "rgba(79,70,229,0.12)", color: "#818CF8", fontSize: 11, fontWeight: 700, cursor: "pointer", fontFamily: "inherit" }}>Hoy</button>
          <button onClick={() => setCurrent(d => addMonths(d, 1))} style={{ width: 32, height: 32, borderRadius: 9, border: "1px solid rgba(255,255,255,0.08)", background: "rgba(255,255,255,0.04)", color: "#94A3B8", fontSize: 16, cursor: "pointer" }}>&#8250;</button>
        </div>
      </div>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", marginBottom: 4 }}>
        {["Lu","Ma","Mi","Ju","Vi","Sa","Do"].map(d => (
          <div key={d} style={{ textAlign: "center", color: "#334155", fontSize: 10, fontWeight: 700, padding: "4px 0" }}>{d}</div>
        ))}
      </div>
      <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 18, padding: 8, marginBottom: 20 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", gap: 2 }}>
          {Array.from({ length: startPad }).map((_, i) => <div key={"p"+i} />)}
          {days.map(day => {
            const hasE = eventsForDay(day).length > 0;
            const hasT = tasksForDay(day).length > 0;
            const sel = isSameDay(day, selected);
            const tod = isToday(day);
            return (
              <button key={day.toISOString()} onClick={() => setSelected(day)} style={{
                position: "relative", aspectRatio: "1", display: "flex", flexDirection: "column",
                alignItems: "center", justifyContent: "center", borderRadius: 10, border: "none",
                cursor: "pointer", fontSize: 12, fontWeight: sel || tod ? 700 : 400, fontFamily: "inherit",
                background: sel ? "linear-gradient(135deg,#4F46E5,#7C3AED)" : tod ? "rgba(79,70,229,0.15)" : "transparent",
                color: sel ? "#fff" : tod ? "#818CF8" : "#64748B",
              }}>
                {format(day, "d")}
                {(hasE || hasT) && (
                  <div style={{ position: "absolute", bottom: 2, display: "flex", gap: 1 }}>
                    {hasT && <span style={{ width: 3, height: 3, borderRadius: "50%", background: sel ? "rgba(255,255,255,0.7)" : "#818CF8" }} />}
                    {hasE && <span style={{ width: 3, height: 3, borderRadius: "50%", background: sel ? "rgba(255,255,255,0.7)" : "#34D399" }} />}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>
      <h2 style={{ color: "#64748B", fontSize: 11, fontWeight: 700, margin: "0 0 10px", textTransform: "uppercase", letterSpacing: "0.05em" }}>
        {format(selected, "EEEE d 'de' MMMM", { locale: es })}
      </h2>
      {selectedTasks.length === 0 && selectedEvents.length === 0 ? (
        <div style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 14, padding: "24px 20px", textAlign: "center" }}>
          <p style={{ color: "#334155", fontSize: 13, margin: 0 }}>Sin tareas ni eventos</p>
        </div>
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          {selectedTasks.map(t => (
            <div key={t.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: "3px solid " + PRIORITY_COLOR[t.priority], borderRadius: 14, padding: "12px 14px" }}>
              <p style={{ color: "#E2E8F0", fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>{t.title}</p>
              <p style={{ color: "#475569", fontSize: 11, margin: 0 }}>{"📋 " + (t.dueDate ? format(new Date(t.dueDate), "HH:mm") : "Sin hora")}</p>
            </div>
          ))}
          {selectedEvents.map(ev => (
            <div key={ev.id} style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)", borderLeft: "3px solid " + (ev.color ?? "#10B981"), borderRadius: 14, padding: "12px 14px" }}>
              <p style={{ color: "#E2E8F0", fontSize: 13, fontWeight: 600, margin: "0 0 2px" }}>{ev.title}</p>
              <p style={{ color: "#475569", fontSize: 11, margin: 0 }}>{"📅 " + format(new Date(ev.startDate), "HH:mm")}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );

  // Desktop full grid calendar
  const DAYS = ["LUNES","MARTES","MIÉRCOLES","JUEVES","VIERNES","SÁBADO","DOMINGO"];
  const allCells: (Date | null)[] = [...Array.from({ length: startPad }, () => null as null), ...days];
  // Fill to complete last row
  const remainder = allCells.length % 7;
  if (remainder !== 0) for (let i = 0; i < 7 - remainder; i++) allCells.push(null);
  const weeks = [];
  for (let i = 0; i < allCells.length; i += 7) weeks.push(allCells.slice(i, i + 7));

  const DesktopCalendar = (
    <div style={{ padding: "32px 48px 0" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 16, gap: 24 }}>
        <h1 style={{ color: "#F1F5F9", fontSize: 28, fontWeight: 800, margin: 0, letterSpacing: "-0.03em" }}>Calendario</h1>
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginLeft: "auto" }}>
          <button onClick={() => setCurrent(d => subMonths(d, 1))} style={{ background: "none", border: "none", color: "#818CF8", fontSize: 22, cursor: "pointer" }}>‹</button>
          <span style={{ color: "#E2E8F0", fontSize: 18, fontWeight: 700, minWidth: 130, textAlign: "center", textTransform: "capitalize" }}>
            {format(current, "MMMM yyyy", { locale: es })}
          </span>
          <button onClick={() => setCurrent(d => addMonths(d, 1))} style={{ background: "none", border: "none", color: "#818CF8", fontSize: 22, cursor: "pointer" }}>›</button>
        </div>
        {/* Mes / Semana toggle */}
        <div style={{ display: "flex", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.08)", borderRadius: 16, padding: 2 }}>
          <span style={{ padding: "6px 20px", borderRadius: 14, background: "linear-gradient(135deg,#4F46E5,#7C3AED)", color: "#fff", fontSize: 11, fontWeight: 700 }}>Mes</span>
          <span style={{ padding: "6px 20px", color: "#475569", fontSize: 11 }}>Semana</span>
        </div>
      </div>

      <div style={{ height: 1, background: "rgba(255,255,255,0.05)", marginBottom: 0 }} />

      {/* Grid */}
      <div style={{ border: "1px solid rgba(255,255,255,0.06)", borderRadius: 12, overflow: "hidden" }}>
        {/* Day headers */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", background: "rgba(255,255,255,0.025)" }}>
          {DAYS.map((d, i) => (
            <div key={d} style={{
              textAlign: "center", padding: "10px 0",
              color: i >= 5 ? "#475569" : "#64748B",
              fontSize: 11, fontWeight: 600,
              borderRight: i < 6 ? "1px solid rgba(255,255,255,0.04)" : "none",
            }}>{d}</div>
          ))}
        </div>

        {/* Weeks */}
        {weeks.map((week, wi) => (
          <div key={wi} style={{ display: "grid", gridTemplateColumns: "repeat(7,1fr)", borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            {week.map((day, di) => {
              const isWeekend = di >= 5;
              const tod = day && isToday(day);
              const sel = day && isSameDay(day, selected);
              const dayEvents = day ? eventsForDay(day) : [];
              const dayTasks = day ? tasksForDay(day) : [];

              return (
                <div
                  key={di}
                  onClick={() => day && setSelected(day)}
                  style={{
                    minHeight: 100, padding: "8px", cursor: day ? "pointer" : "default",
                    borderRight: di < 6 ? "1px solid rgba(255,255,255,0.04)" : "none",
                    background: tod ? "rgba(79,70,229,0.06)" : sel ? "rgba(79,70,229,0.04)" : isWeekend ? "rgba(0,0,0,0.1)" : "transparent",
                  }}
                >
                  {day && (
                    <>
                      {tod ? (
                        <div style={{
                          width: 28, height: 28, borderRadius: "50%",
                          background: "linear-gradient(135deg,#4F46E5,#7C3AED)",
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 12, fontWeight: 700, color: "#fff", marginBottom: 4,
                        }}>{format(day, "d")}</div>
                      ) : (
                        <p style={{
                          color: isWeekend ? "#475569" : "#64748B",
                          fontSize: 12, margin: "0 0 4px", textAlign: "right",
                        }}>{format(day, "d")}</p>
                      )}
                      {/* Task dots */}
                      {dayTasks.slice(0, 2).map(t => (
                        <div key={t.id} style={{
                          background: "rgba(79,70,229,0.28)", border: "0.5px solid #4F46E5",
                          borderRadius: 5, padding: "2px 6px", marginBottom: 2,
                          fontSize: 10, color: "#818CF8",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>{t.title}</div>
                      ))}
                      {/* Events */}
                      {dayEvents.slice(0, 2).map(ev => (
                        <div key={ev.id} style={{
                          background: `${ev.color ?? "#10B981"}22`, border: "0.5px solid " + (ev.color ?? "#10B981"),
                          borderRadius: 5, padding: "2px 6px", marginBottom: 2,
                          fontSize: 10, color: ev.color ?? "#34D399",
                          overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap",
                        }}>{format(new Date(ev.startDate), "HH:mm")} {ev.title}</div>
                      ))}
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <div className="cal-mobile">{MobileCalendar}</div>
      <div className="cal-desktop">{DesktopCalendar}</div>
      <style>{`
        .cal-mobile { display: block; }
        .cal-desktop { display: none; }
        @media (min-width: 1024px) {
          .cal-mobile { display: none; }
          .cal-desktop { display: block; }
        }
      `}</style>
    </>
  );
}
