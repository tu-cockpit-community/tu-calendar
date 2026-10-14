import React, { useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Clock,
  Bookmark,
  CheckCircle2,
  Circle,
} from "lucide-react";
import { DeadlineTask } from "../types/calendar";

interface CalendarMonthViewProps {
  tasks: DeadlineTask[];
  onToggleTask: (id: string) => void;
}

export const CalendarMonthView: React.FC<CalendarMonthViewProps> = ({
  tasks,
  onToggleTask,
}) => {
  const [currentDate, setCurrentDate] = useState<Date>(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(new Date());

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const firstDayOfMonth = new Date(year, month, 1);
  const lastDayOfMonth = new Date(year, month + 1, 0);

  // Month navigation
  const prevMonth = () => setCurrentDate(new Date(year, month - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(year, month + 1, 1));
  const goToToday = () => {
    const today = new Date();
    setCurrentDate(today);
    setSelectedDate(today);
  };

  // Compute days in grid (starting Monday)
  const startingDay = (firstDayOfMonth.getDay() + 6) % 7; // 0 = Mon, 6 = Sun
  const totalDays = lastDayOfMonth.getDate();

  const daysGrid: Array<{ day: number; date: Date; isCurrentMonth: boolean }> = [];

  // Previous month trailing days
  const prevMonthLastDay = new Date(year, month, 0).getDate();
  for (let i = startingDay - 1; i >= 0; i--) {
    const d = prevMonthLastDay - i;
    daysGrid.push({
      day: d,
      date: new Date(year, month - 1, d),
      isCurrentMonth: false,
    });
  }

  // Current month days
  for (let d = 1; d <= totalDays; d++) {
    daysGrid.push({
      day: d,
      date: new Date(year, month, d),
      isCurrentMonth: true,
    });
  }

  // Next month leading days to complete 35 or 42 cells
  const remainingCells = (7 - (daysGrid.length % 7)) % 7;
  for (let d = 1; d <= remainingCells; d++) {
    daysGrid.push({
      day: d,
      date: new Date(year, month + 1, d),
      isCurrentMonth: false,
    });
  }

  const isSameDay = (d1: Date, d2: Date) =>
    d1.getFullYear() === d2.getFullYear() &&
    d1.getMonth() === d2.getMonth() &&
    d1.getDate() === d2.getDate();

  const selectedDateTasks = selectedDate
    ? tasks.filter((t) => isSameDay(new Date(t.dueDate), selectedDate))
    : [];

  const monthName = currentDate.toLocaleDateString("de-AT", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="flex-1 flex flex-col sm:flex-row h-full overflow-hidden bg-[var(--tu-bg-base)]">
      {/* Calendar Grid Area */}
      <div className="flex-1 flex flex-col h-full overflow-hidden border-r border-[var(--tu-border)]">
        {/* Month Navigation Header */}
        <div className="p-4 border-b border-[var(--tu-border)] bg-[var(--tu-bg-surface)] flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-[var(--tu-text-primary)] capitalize">
              {monthName}
            </h2>
            <button
              onClick={goToToday}
              className="px-2 py-0.5 rounded-[var(--tu-radius-sm)] bg-[var(--tu-bg-card)] border border-[var(--tu-border)] hover:bg-[var(--tu-bg-hover)] text-[10px] font-semibold text-[var(--tu-text-secondary)] transition-colors cursor-pointer"
            >
              Today
            </button>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={prevMonth}
              className="p-1 rounded text-[var(--tu-text-muted)] hover:text-[var(--tu-text-primary)] hover:bg-[var(--tu-bg-hover)] transition-colors cursor-pointer"
              title="Previous Month"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={nextMonth}
              className="p-1 rounded text-[var(--tu-text-muted)] hover:text-[var(--tu-text-primary)] hover:bg-[var(--tu-bg-hover)] transition-colors cursor-pointer"
              title="Next Month"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Days of Week Header */}
        <div className="grid grid-cols-7 border-b border-[var(--tu-border)] bg-[var(--tu-bg-card)] text-center text-xs font-semibold text-[var(--tu-text-muted)] py-2">
          <span>Mo</span>
          <span>Di</span>
          <span>Mi</span>
          <span>Do</span>
          <span>Fr</span>
          <span className="text-rose-400/80">Sa</span>
          <span className="text-rose-400/80">So</span>
        </div>

        {/* Calendar Cells Grid */}
        <div className="flex-1 grid grid-cols-7 grid-rows-5 sm:grid-rows-6 divide-x divide-y divide-[var(--tu-border)]/50 overflow-y-auto">
          {daysGrid.map((cell, idx) => {
            const isToday = isSameDay(cell.date, new Date());
            const isSelected = selectedDate ? isSameDay(cell.date, selectedDate) : false;
            const dayTasks = tasks.filter((t) => isSameDay(new Date(t.dueDate), cell.date));

            return (
              <div
                key={idx}
                onClick={() => setSelectedDate(cell.date)}
                className={`p-1.5 flex flex-col gap-1 transition-colors cursor-pointer min-h-[60px] ${
                  isSelected
                    ? "bg-[var(--tu-accent)]/15 ring-1 ring-[var(--tu-accent)] inset-0"
                    : cell.isCurrentMonth
                    ? "bg-[var(--tu-bg-surface)] hover:bg-[var(--tu-bg-hover)]"
                    : "bg-[var(--tu-bg-base)]/60 opacity-40 hover:opacity-80"
                }`}
              >
                <div className="flex items-center justify-between">
                  <span
                    className={`text-xs font-semibold rounded-full w-5 h-5 flex items-center justify-center ${
                      isToday
                        ? "bg-[var(--tu-accent)] text-[var(--tu-accent-contrast)] font-bold shadow-sm"
                        : cell.isCurrentMonth
                        ? "text-[var(--tu-text-primary)]"
                        : "text-[var(--tu-text-muted)]"
                    }`}
                  >
                    {cell.day}
                  </span>
                  {dayTasks.length > 0 && (
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  )}
                </div>

                {/* Day Tasks Badges */}
                <div className="flex-1 flex flex-col gap-1 overflow-hidden">
                  {dayTasks.slice(0, 2).map((t) => (
                    <div
                      key={t.id}
                      className={`px-1 py-0.5 rounded text-[9px] font-medium truncate leading-tight border ${
                        t.completed
                          ? "bg-slate-500/10 text-[var(--tu-text-muted)] line-through border-transparent"
                          : t.source === "TUWEL"
                          ? "bg-amber-500/15 border-amber-500/30 text-amber-400"
                          : "bg-sky-500/15 border-sky-500/30 text-sky-400"
                      }`}
                      title={t.title}
                    >
                      {t.title}
                    </div>
                  ))}
                  {dayTasks.length > 2 && (
                    <span className="text-[8px] font-mono text-[var(--tu-text-muted)]">
                      +{dayTasks.length - 2} more
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Day Agenda Drawer (Side Panel) */}
      <div className="w-full sm:w-72 bg-[var(--tu-bg-card)] flex flex-col p-4 space-y-4 shrink-0 overflow-y-auto">
        <div className="flex items-center justify-between border-b border-[var(--tu-border)] pb-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-[var(--tu-text-primary)]">
            <CalendarIcon className="w-3.5 h-3.5 text-[var(--tu-accent)]" />
            <span>
              {selectedDate?.toLocaleDateString("de-AT", {
                weekday: "short",
                day: "numeric",
                month: "long",
              })}
            </span>
          </div>
          <span className="text-xs text-[var(--tu-text-muted)]">
            {selectedDateTasks.length} {selectedDateTasks.length === 1 ? "task" : "tasks"}
          </span>
        </div>

        {selectedDateTasks.length === 0 ? (
          <div className="p-8 text-center text-xs text-[var(--tu-text-muted)] space-y-1">
            <p>No deadlines scheduled for this date.</p>
          </div>
        ) : (
          <div className="space-y-2">
            {selectedDateTasks.map((task) => (
              <div
                key={task.id}
                className="p-3 bg-[var(--tu-bg-surface)] border border-[var(--tu-border)] rounded-[var(--tu-radius-sm)] flex items-start gap-2.5 text-xs shadow-sm"
              >
                <button
                  onClick={() => onToggleTask(task.id)}
                  className="mt-0.5 text-[var(--tu-text-muted)] hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                >
                  {task.completed ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                  ) : (
                    <Circle className="w-4 h-4" />
                  )}
                </button>
                <div className="flex-1 min-w-0 space-y-1">
                  <h4
                    className={`font-semibold text-xs leading-snug ${
                      task.completed
                        ? "text-[var(--tu-text-muted)] line-through"
                        : "text-[var(--tu-text-primary)]"
                    }`}
                  >
                    {task.title}
                  </h4>
                  <div className="flex items-center gap-1 text-[10px] text-[var(--tu-text-muted)]">
                    <Bookmark className="w-2.5 h-2.5" />
                    <span className="truncate">{task.courseName}</span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] font-mono text-[var(--tu-text-accent)]">
                    <Clock className="w-2.5 h-2.5" />
                    <span>
                      {new Date(task.dueDate).toLocaleTimeString("de-AT", {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
