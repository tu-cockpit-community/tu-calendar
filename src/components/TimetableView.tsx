import React from "react";
import { MapPin, Clock, User, Calendar as CalendarIcon } from "lucide-react";
import { TimetableEvent, CourseType } from "../types/calendar";

interface TimetableViewProps {
  events: TimetableEvent[];
}

const DAYS = [
  { num: 1, name: "Monday", short: "Mo" },
  { num: 2, name: "Tuesday", short: "Di" },
  { num: 3, name: "Wednesday", short: "Mi" },
  { num: 4, name: "Thursday", short: "Do" },
  { num: 5, name: "Friday", short: "Fr" },
];

const TIME_SLOTS = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
  "17:00",
  "18:00",
  "19:00",
];

export const TimetableView: React.FC<TimetableViewProps> = ({ events }) => {
  const currentDayOfWeek = new Date().getDay(); // 0 = Sun, 1 = Mon ...

  const getTypeStyle = (type: CourseType) => {
    switch (type) {
      case "VO":
        return "bg-sky-500/15 border-sky-500/30 text-sky-400";
      case "UE":
        return "bg-emerald-500/15 border-emerald-500/30 text-emerald-400";
      case "VU":
        return "bg-purple-500/15 border-purple-500/30 text-purple-400";
      case "PR":
        return "bg-amber-500/15 border-amber-500/30 text-amber-400";
      default:
        return "bg-slate-500/15 border-slate-500/30 text-slate-400";
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--tu-bg-base)]">
      {/* Top Banner */}
      <div className="p-4 border-b border-[var(--tu-border)] bg-[var(--tu-bg-surface)] flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <CalendarIcon className="w-4 h-4 text-[var(--tu-accent)]" />
          <h2 className="text-sm font-bold text-[var(--tu-text-primary)]">
            Weekly Lecture Schedule (Stundenplan)
          </h2>
        </div>
        <div className="text-xs text-[var(--tu-text-muted)] flex items-center gap-3">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-sky-400"></span> Vorlesung (VO)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Übung (UE)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-purple-400"></span> Vorlesung+Übung (VU)
          </span>
        </div>
      </div>

      {events.length === 0 && (
        <div className="mx-4 sm:mx-6 mt-4 p-3 bg-sky-500/10 border border-sky-500/25 rounded-[var(--tu-radius)] text-xs text-sky-300 flex items-center justify-between">
          <span>Stundenplan ist leer. Öffne TISS für automatische Synchronisation oder importiere eine .ics Datei.</span>
        </div>
      )}

      {/* Timetable Grid Container */}
      <div className="flex-1 overflow-x-auto overflow-y-auto p-4 sm:p-6">
        <div className="min-w-[700px] border border-[var(--tu-border)] rounded-[var(--tu-radius)] bg-[var(--tu-bg-surface)] overflow-hidden shadow-sm">
          {/* Header Row: Days of Week */}
          <div className="grid grid-cols-6 border-b border-[var(--tu-border)] bg-[var(--tu-bg-card)]">
            <div className="p-3 text-center text-xs font-semibold text-[var(--tu-text-muted)] border-r border-[var(--tu-border)]">
              Time
            </div>
            {DAYS.map((day) => {
              const isToday = currentDayOfWeek === day.num;
              return (
                <div
                  key={day.num}
                  className={`p-3 text-center border-r border-[var(--tu-border)] last:border-r-0 ${
                    isToday ? "bg-[var(--tu-accent)]/15" : ""
                  }`}
                >
                  <span
                    className={`text-xs font-bold ${
                      isToday ? "text-[var(--tu-accent)] font-extrabold" : "text-[var(--tu-text-primary)]"
                    }`}
                  >
                    {day.name}
                  </span>
                  {isToday && (
                    <span className="ml-1.5 px-1.5 py-0.2 rounded-full bg-[var(--tu-accent)] text-[var(--tu-accent-contrast)] text-[9px] font-semibold">
                      Today
                    </span>
                  )}
                </div>
              );
            })}
          </div>

          {/* Grid Rows: Time Slots & Course Cards */}
          <div className="divide-y divide-[var(--tu-border)]/50">
            {TIME_SLOTS.map((slot) => {
              const hourNumber = parseInt(slot.split(":")[0], 10);
              return (
                <div key={slot} className="grid grid-cols-6 min-h-[70px]">
                  {/* Time label */}
                  <div className="p-2 border-r border-[var(--tu-border)] text-center font-mono text-[11px] text-[var(--tu-text-muted)] bg-[var(--tu-bg-card)]/40 flex items-center justify-center">
                    {slot}
                  </div>

                  {/* 5 Day Columns */}
                  {DAYS.map((day) => {
                    const dayEvents = events.filter((e) => {
                      if (e.dayOfWeek !== day.num) return false;
                      const eventHour = parseInt(e.startTime.split(":")[0], 10);
                      return eventHour === hourNumber;
                    });

                    return (
                      <div
                        key={day.num}
                        className="p-1.5 border-r border-[var(--tu-border)] last:border-r-0 relative flex flex-col gap-1.5"
                      >
                        {dayEvents.map((event) => (
                          <div
                            key={event.id}
                            className={`p-2 rounded-[var(--tu-radius-sm)] border text-xs shadow-sm hover:scale-[1.02] transition-transform cursor-pointer ${getTypeStyle(
                              event.type
                            )}`}
                          >
                            <div className="flex items-center justify-between gap-1 mb-1">
                              <span className="px-1 py-0.2 rounded font-bold font-mono text-[10px] bg-black/20">
                                {event.type}
                              </span>
                              <span className="text-[10px] font-mono opacity-85 flex items-center gap-0.5">
                                <Clock className="w-2.5 h-2.5" />
                                {event.startTime} - {event.endTime}
                              </span>
                            </div>

                            <h4 className="font-bold text-[11px] text-[var(--tu-text-primary)] leading-tight mb-1 line-clamp-2">
                              {event.courseName}
                            </h4>

                            <div className="flex items-center gap-1 text-[10px] opacity-90 truncate">
                              <MapPin className="w-3 h-3 shrink-0" />
                              <span className="font-semibold truncate">{event.room}</span>
                            </div>

                            {event.lecturer && (
                              <div className="flex items-center gap-1 text-[10px] text-[var(--tu-text-muted)] mt-1 truncate">
                                <User className="w-2.5 h-2.5 shrink-0" />
                                <span className="truncate">{event.lecturer}</span>
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    );
                  })}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
