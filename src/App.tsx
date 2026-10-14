import React, { useState, useEffect } from "react";
import {
  Calendar as CalendarIcon,
  CheckSquare,
  Clock,
  DownloadCloud,
  X,
  RefreshCw,
} from "lucide-react";
import { DeadlineTask, TimetableEvent } from "./types/calendar";
import { TaskStorageService } from "./services/taskStorage";
import { ICalParserService } from "./services/iCalParser";
import { TasksChecklistView } from "./components/TasksChecklistView";
import { TimetableView } from "./components/TimetableView";
import { CalendarMonthView } from "./components/CalendarMonthView";

type ActiveTab = "tasks" | "timetable" | "calendar";

export const App: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("tasks");
  const [tasks, setTasks] = useState<DeadlineTask[]>([]);
  const [timetable, setTimetable] = useState<TimetableEvent[]>([]);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [iCalUrl, setICalUrl] = useState("");
  const [iCalText, setICalText] = useState("");
  const [isImporting, setIsImporting] = useState(false);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  // Initialize data from local storage
  useEffect(() => {
    setTasks(TaskStorageService.getTasks());
    setTimetable(TaskStorageService.getTimetable());
  }, []);

  const handleToggleTask = (id: string) => {
    const updated = TaskStorageService.toggleTask(id);
    setTasks(updated);
  };

  const handleAddTask = (taskData: Omit<DeadlineTask, "id" | "completed">) => {
    const updated = TaskStorageService.addTask(taskData);
    setTasks(updated);
  };

  const handleDeleteTask = (id: string) => {
    const updated = TaskStorageService.deleteTask(id);
    setTasks(updated);
  };

  const handleImportIcs = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsImporting(true);
    setImportStatus(null);

    try {
      let content = iCalText;
      if (iCalUrl.trim()) {
        const res = await fetch(iCalUrl.trim());
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        content = await res.text();
      }

      if (!content.trim()) {
        throw new Error("Please enter a valid iCal URL or paste .ics text.");
      }

      const parsed = ICalParserService.parseIcs(content);
      const newTasks = ICalParserService.convertToDeadlineTasks(parsed);

      if (newTasks.length === 0) {
        throw new Error("No VEVENT records found in iCalendar feed.");
      }

      const merged = [...newTasks, ...tasks.filter((t) => !newTasks.some((nt) => nt.id === t.id))];
      TaskStorageService.saveTasks(merged);
      setTasks(merged);

      setImportStatus(`Successfully imported ${newTasks.length} events!`);
      setTimeout(() => {
        setIsImportModalOpen(false);
        setImportStatus(null);
        setICalUrl("");
        setICalText("");
      }, 1200);
    } catch (err: any) {
      setImportStatus(`Import error: ${err.message || "Failed to parse feed"}`);
    } finally {
      setIsImporting(false);
    }
  };

  const pendingCount = tasks.filter((t) => !t.completed).length;

  return (
    <div className="w-screen h-screen flex flex-col bg-[var(--tu-bg-base)] text-[var(--tu-text-primary)] overflow-hidden">
      {/* Top Application Bar */}
      <header className="h-12 border-b border-[var(--tu-border)] bg-[var(--tu-bg-card)] px-4 flex items-center justify-between shrink-0 select-none text-xs gap-3">
        {/* Left: Branding & Tagline */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-[var(--tu-accent)]/15 border border-[var(--tu-accent)]/30 text-[var(--tu-accent)] font-bold text-xs">
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>TU Calendar</span>
          </div>
          <span className="hidden md:inline text-[var(--tu-text-muted)] text-[11px]">
            Academic Timetable & Tasks
          </span>
        </div>

        {/* Center: Main View Navigation Tabs */}
        <nav className="flex items-center bg-[var(--tu-bg-surface)] p-1 rounded-[var(--tu-radius-sm)] border border-[var(--tu-border)] gap-1">
          <button
            onClick={() => setActiveTab("tasks")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-[var(--tu-radius-sm)] font-medium text-xs transition-colors cursor-pointer ${
              activeTab === "tasks"
                ? "bg-[var(--tu-accent)] text-[var(--tu-accent-contrast)] shadow-sm"
                : "text-[var(--tu-text-secondary)] hover:text-[var(--tu-text-primary)] hover:bg-[var(--tu-bg-hover)]"
            }`}
          >
            <CheckSquare className="w-3.5 h-3.5" />
            <span>Tasks</span>
            {pendingCount > 0 && (
              <span
                className={`ml-1 px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold ${
                  activeTab === "tasks"
                    ? "bg-white/20 text-white"
                    : "bg-[var(--tu-accent)]/20 text-[var(--tu-accent)]"
                }`}
              >
                {pendingCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("timetable")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-[var(--tu-radius-sm)] font-medium text-xs transition-colors cursor-pointer ${
              activeTab === "timetable"
                ? "bg-[var(--tu-accent)] text-[var(--tu-accent-contrast)] shadow-sm"
                : "text-[var(--tu-text-secondary)] hover:text-[var(--tu-text-primary)] hover:bg-[var(--tu-bg-hover)]"
            }`}
          >
            <Clock className="w-3.5 h-3.5" />
            <span>Timetable</span>
          </button>

          <button
            onClick={() => setActiveTab("calendar")}
            className={`flex items-center gap-1.5 px-3 py-1 rounded-[var(--tu-radius-sm)] font-medium text-xs transition-colors cursor-pointer ${
              activeTab === "calendar"
                ? "bg-[var(--tu-accent)] text-[var(--tu-accent-contrast)] shadow-sm"
                : "text-[var(--tu-text-secondary)] hover:text-[var(--tu-text-primary)] hover:bg-[var(--tu-bg-hover)]"
            }`}
          >
            <CalendarIcon className="w-3.5 h-3.5" />
            <span>Calendar</span>
          </button>
        </nav>

        {/* Right: Actions */}
        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={() => setIsImportModalOpen(true)}
            className="flex items-center gap-1.5 px-2.5 py-1 rounded-[var(--tu-radius-sm)] bg-[var(--tu-bg-surface)] hover:bg-[var(--tu-bg-hover)] border border-[var(--tu-border)] text-[var(--tu-text-secondary)] hover:text-[var(--tu-text-primary)] transition-colors cursor-pointer text-xs"
            title="Import TUWEL / TISS iCal Calendar Feed"
          >
            <DownloadCloud className="w-3.5 h-3.5 text-[var(--tu-accent)]" />
            <span className="hidden sm:inline">Import iCal</span>
          </button>
        </div>
      </header>

      {/* Main View Area */}
      <main className="flex-1 overflow-hidden relative">
        {activeTab === "tasks" && (
          <TasksChecklistView
            tasks={tasks}
            onToggleTask={handleToggleTask}
            onAddTask={handleAddTask}
            onDeleteTask={handleDeleteTask}
          />
        )}

        {activeTab === "timetable" && <TimetableView events={timetable} />}

        {activeTab === "calendar" && (
          <CalendarMonthView tasks={tasks} onToggleTask={handleToggleTask} />
        )}
      </main>

      {/* iCal Feed Import Modal */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[var(--tu-bg-surface)] border border-[var(--tu-border)] rounded-[var(--tu-radius-lg)] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
            <div className="p-4 border-b border-[var(--tu-border)] flex items-center justify-between bg-[var(--tu-bg-card)]">
              <div className="flex items-center gap-2">
                <DownloadCloud className="w-4 h-4 text-[var(--tu-accent)]" />
                <h3 className="font-bold text-sm text-[var(--tu-text-primary)]">
                  Import Calendar (.ics)
                </h3>
              </div>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="text-[var(--tu-text-muted)] hover:text-[var(--tu-text-primary)] p-1 cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleImportIcs} className="p-4 space-y-3 text-xs">
              <div>
                <label className="block text-xs font-semibold text-[var(--tu-text-secondary)] mb-1">
                  iCal Feed URL (from TUWEL or TISS)
                </label>
                <input
                  type="url"
                  placeholder="https://tuwel.tuwien.ac.at/calendar/export_execute.php?..."
                  value={iCalUrl}
                  onChange={(e) => setICalUrl(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[var(--tu-bg-card)] border border-[var(--tu-border)] rounded-[var(--tu-radius-sm)] text-[var(--tu-text-primary)] placeholder:text-[var(--tu-text-muted)] focus:outline-none focus:border-[var(--tu-accent)]"
                />
              </div>

              <div className="text-center text-[10px] text-[var(--tu-text-muted)] font-bold uppercase tracking-wider">
                — OR PASTE .ICS FILE CONTENT —
              </div>

              <div>
                <textarea
                  rows={4}
                  placeholder="BEGIN:VCALENDAR&#10;BEGIN:VEVENT&#10;SUMMARY:..."
                  value={iCalText}
                  onChange={(e) => setICalText(e.target.value)}
                  className="w-full px-3 py-1.5 bg-[var(--tu-bg-card)] border border-[var(--tu-border)] rounded-[var(--tu-radius-sm)] text-[var(--tu-text-primary)] font-mono text-[11px] placeholder:text-[var(--tu-text-muted)] focus:outline-none focus:border-[var(--tu-accent)]"
                />
              </div>

              {importStatus && (
                <div
                  className={`p-2.5 rounded-[var(--tu-radius-sm)] text-xs border ${
                    importStatus.startsWith("Success")
                      ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                      : "bg-rose-500/15 border-rose-500/30 text-rose-400"
                  }`}
                >
                  {importStatus}
                </div>
              )}

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-3 py-1.5 bg-[var(--tu-bg-card)] hover:bg-[var(--tu-bg-hover)] border border-[var(--tu-border)] text-[var(--tu-text-secondary)] rounded-[var(--tu-radius-sm)] font-medium cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isImporting}
                  className="px-4 py-1.5 bg-[var(--tu-accent)] hover:bg-[var(--tu-accent-hover)] text-[var(--tu-accent-contrast)] font-semibold rounded-[var(--tu-radius-sm)] flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
                >
                  {isImporting && <RefreshCw className="w-3.5 h-3.5 animate-spin" />}
                  <span>Import Feed</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
