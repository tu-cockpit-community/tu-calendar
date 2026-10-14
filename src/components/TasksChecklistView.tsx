import React, { useState } from "react";
import {
  CheckCircle2,
  Circle,
  Clock,
  Plus,
  Trash2,
  ChevronDown,
  ChevronRight,
  Sparkles,
  Bookmark,
} from "lucide-react";
import { DeadlineTask, TaskPriority, TaskSource } from "../types/calendar";

interface TasksChecklistViewProps {
  tasks: DeadlineTask[];
  onToggleTask: (id: string) => void;
  onAddTask: (task: Omit<DeadlineTask, "id" | "completed">) => void;
  onDeleteTask: (id: string) => void;
}

export const TasksChecklistView: React.FC<TasksChecklistViewProps> = ({
  tasks,
  onToggleTask,
  onAddTask,
  onDeleteTask,
}) => {
  const [filter, setFilter] = useState<"all" | "tuwel" | "custom">("all");
  const [showCompleted, setShowCompleted] = useState<boolean>(true);

  // New task form state
  const [newTitle, setNewTitle] = useState("");
  const [newCourse, setNewCourse] = useState("");
  const [newDueHours, setNewDueHours] = useState("48");
  const [newPriority, setNewPriority] = useState<TaskPriority>("medium");
  const [isAddingOpen, setIsAddingOpen] = useState(false);

  const filteredTasks = tasks.filter((t) => {
    if (filter === "tuwel") return t.source === "TUWEL";
    if (filter === "custom") return t.source === "CUSTOM";
    return true;
  });

  const activeTasks = filteredTasks.filter((t) => !t.completed);
  const completedTasks = filteredTasks.filter((t) => t.completed);

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const dueDate = new Date(Date.now() + parseInt(newDueHours, 10) * 3600 * 1000).toISOString();
    onAddTask({
      title: newTitle.trim(),
      courseName: newCourse.trim() || "Personal Study",
      dueDate,
      source: "CUSTOM" as TaskSource,
      priority: newPriority,
    });

    setNewTitle("");
    setNewCourse("");
    setIsAddingOpen(false);
  };

  const getUrgencyBadge = (isoDate: string) => {
    const diff = new Date(isoDate).getTime() - Date.now();
    const hours = Math.floor(diff / (1000 * 60 * 60));

    if (diff < 0) {
      return {
        label: "Overdue",
        style: "bg-rose-500/15 text-rose-400 border-rose-500/30",
        urgent: true,
      };
    }
    if (hours < 12) {
      return {
        label: `In ${Math.max(1, hours)}h`,
        style: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        urgent: true,
      };
    }
    if (hours < 24) {
      return {
        label: "Due Today",
        style: "bg-amber-500/15 text-amber-400 border-amber-500/30",
        urgent: true,
      };
    }
    if (hours < 48) {
      return {
        label: "Tomorrow",
        style: "bg-sky-500/15 text-sky-400 border-sky-500/30",
        urgent: false,
      };
    }
    const days = Math.floor(hours / 24);
    return {
      label: `In ${days} days`,
      style: "bg-[var(--tu-bg-surface)] text-[var(--tu-text-secondary)] border-[var(--tu-border)]",
      urgent: false,
    };
  };

  return (
    <div className="flex-1 flex flex-col h-full overflow-hidden bg-[var(--tu-bg-base)]">
      {/* Top Action Bar */}
      <div className="p-4 border-b border-[var(--tu-border)] bg-[var(--tu-bg-surface)] flex items-center justify-between gap-3 shrink-0">
        {/* Filters */}
        <div className="flex items-center gap-1.5 text-xs">
          <button
            onClick={() => setFilter("all")}
            className={`px-3 py-1 rounded-[var(--tu-radius-sm)] border font-medium transition-colors cursor-pointer ${
              filter === "all"
                ? "bg-[var(--tu-accent)] text-[var(--tu-accent-contrast)] border-[var(--tu-accent)]"
                : "bg-[var(--tu-bg-card)] border-[var(--tu-border)] text-[var(--tu-text-secondary)] hover:text-[var(--tu-text-primary)]"
            }`}
          >
            All Tasks ({tasks.length})
          </button>
          <button
            onClick={() => setFilter("tuwel")}
            className={`px-3 py-1 rounded-[var(--tu-radius-sm)] border font-medium transition-colors cursor-pointer ${
              filter === "tuwel"
                ? "bg-[var(--tu-accent)] text-[var(--tu-accent-contrast)] border-[var(--tu-accent)]"
                : "bg-[var(--tu-bg-card)] border-[var(--tu-border)] text-[var(--tu-text-secondary)] hover:text-[var(--tu-text-primary)]"
            }`}
          >
            TUWEL Deadlines
          </button>
          <button
            onClick={() => setFilter("custom")}
            className={`px-3 py-1 rounded-[var(--tu-radius-sm)] border font-medium transition-colors cursor-pointer ${
              filter === "custom"
                ? "bg-[var(--tu-accent)] text-[var(--tu-accent-contrast)] border-[var(--tu-accent)]"
                : "bg-[var(--tu-bg-card)] border-[var(--tu-border)] text-[var(--tu-text-secondary)] hover:text-[var(--tu-text-primary)]"
            }`}
          >
            Personal Tasks
          </button>
        </div>

        {/* Quick Add Button */}
        <button
          onClick={() => setIsAddingOpen((v) => !v)}
          className="flex items-center gap-1.5 px-3 py-1.5 bg-[var(--tu-accent)] hover:bg-[var(--tu-accent-hover)] text-[var(--tu-accent-contrast)] rounded-[var(--tu-radius-sm)] text-xs font-semibold shadow-sm transition-colors cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          <span>Add Task</span>
        </button>
      </div>

      {/* Task Creation Drawer */}
      {isAddingOpen && (
        <form
          onSubmit={handleCreateTask}
          className="p-4 bg-[var(--tu-bg-card)] border-b border-[var(--tu-border)] flex flex-wrap items-center gap-2.5 text-xs animate-in slide-in-from-top-2 duration-150 shrink-0"
        >
          <input
            type="text"
            required
            placeholder="Task title (e.g. Study for Math exam, Submit Lab 3)..."
            value={newTitle}
            onChange={(e) => setNewTitle(e.target.value)}
            className="flex-1 min-w-[200px] px-3 py-1.5 bg-[var(--tu-bg-surface)] border border-[var(--tu-border)] rounded-[var(--tu-radius-sm)] text-[var(--tu-text-primary)] placeholder:text-[var(--tu-text-muted)] focus:outline-none focus:border-[var(--tu-accent)]"
          />
          <input
            type="text"
            placeholder="Course (optional)"
            value={newCourse}
            onChange={(e) => setNewCourse(e.target.value)}
            className="w-40 px-3 py-1.5 bg-[var(--tu-bg-surface)] border border-[var(--tu-border)] rounded-[var(--tu-radius-sm)] text-[var(--tu-text-primary)] placeholder:text-[var(--tu-text-muted)] focus:outline-none focus:border-[var(--tu-accent)]"
          />
          <select
            value={newDueHours}
            onChange={(e) => setNewDueHours(e.target.value)}
            className="px-2.5 py-1.5 bg-[var(--tu-bg-surface)] border border-[var(--tu-border)] rounded-[var(--tu-radius-sm)] text-[var(--tu-text-primary)] focus:outline-none"
          >
            <option value="12">Due Today (in 12h)</option>
            <option value="24">Due Tomorrow (in 24h)</option>
            <option value="48">In 2 Days</option>
            <option value="168">In 1 Week</option>
            <option value="336">In 2 Weeks</option>
          </select>
          <select
            value={newPriority}
            onChange={(e) => setNewPriority(e.target.value as TaskPriority)}
            className="px-2.5 py-1.5 bg-[var(--tu-bg-surface)] border border-[var(--tu-border)] rounded-[var(--tu-radius-sm)] text-[var(--tu-text-primary)] focus:outline-none"
          >
            <option value="high">High Priority</option>
            <option value="medium">Medium Priority</option>
            <option value="low">Low Priority</option>
          </select>
          <button
            type="submit"
            className="px-3.5 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white font-semibold rounded-[var(--tu-radius-sm)] transition-colors cursor-pointer"
          >
            Save Task
          </button>
          <button
            type="button"
            onClick={() => setIsAddingOpen(false)}
            className="px-2.5 py-1.5 text-[var(--tu-text-muted)] hover:text-[var(--tu-text-primary)] transition-colors cursor-pointer"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Main Checklist Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {/* Active Tasks Section */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs font-semibold text-[var(--tu-text-muted)] uppercase tracking-wider px-1">
            <span>Pending Tasks ({activeTasks.length})</span>
            {activeTasks.length === 0 && (
              <span className="text-emerald-400 font-normal normal-case flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5" /> All caught up!
              </span>
            )}
          </div>

          <div className="space-y-1.5">
            {activeTasks.map((task) => {
              const urgency = getUrgencyBadge(task.dueDate);
              return (
                <div
                  key={task.id}
                  className="group flex items-start gap-3 p-3 bg-[var(--tu-bg-card)] hover:bg-[var(--tu-bg-hover)] border border-[var(--tu-border)] rounded-[var(--tu-radius)] transition-all shadow-sm"
                >
                  {/* Google Tasks Checkbox */}
                  <button
                    onClick={() => onToggleTask(task.id)}
                    className="mt-0.5 text-[var(--tu-text-muted)] hover:text-emerald-400 transition-colors cursor-pointer shrink-0"
                    title="Mark task completed"
                  >
                    <Circle className="w-5 h-5 hover:scale-105 transition-transform" />
                  </button>

                  {/* Task Details */}
                  <div className="flex-1 min-w-0 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-semibold text-sm text-[var(--tu-text-primary)] leading-snug">
                        {task.title}
                      </span>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`px-2 py-0.5 rounded-full border text-[10px] font-mono font-medium flex items-center gap-1 ${urgency.style}`}
                        >
                          <Clock className="w-3 h-3" />
                          {urgency.label}
                        </span>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[var(--tu-text-muted)] hover:text-rose-400 transition-all cursor-pointer"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-[var(--tu-text-secondary)]">
                      <span className="flex items-center gap-1 font-medium text-[var(--tu-text-accent)]">
                        <Bookmark className="w-3 h-3" />
                        {task.courseName}
                      </span>
                      <span className="text-[var(--tu-text-muted)]">•</span>
                      <span className="font-mono text-[11px] text-[var(--tu-text-muted)]">
                        {new Date(task.dueDate).toLocaleDateString("de-AT", {
                          weekday: "short",
                          day: "2-digit",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                      {task.source === "TUWEL" && (
                        <span className="px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[10px] font-semibold">
                          TUWEL
                        </span>
                      )}
                    </div>

                    {task.notes && (
                      <p className="text-xs text-[var(--tu-text-muted)] pt-0.5 leading-relaxed">
                        {task.notes}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Completed Tasks Collapsible Section */}
        {completedTasks.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-[var(--tu-border)]">
            <button
              onClick={() => setShowCompleted((v) => !v)}
              className="flex items-center gap-1.5 text-xs font-semibold text-[var(--tu-text-muted)] hover:text-[var(--tu-text-primary)] transition-colors cursor-pointer py-1"
            >
              {showCompleted ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
              <span>Completed ({completedTasks.length})</span>
            </button>

            {showCompleted && (
              <div className="space-y-1.5 opacity-60 hover:opacity-100 transition-opacity">
                {completedTasks.map((task) => (
                  <div
                    key={task.id}
                    className="group flex items-start gap-3 p-2.5 bg-[var(--tu-bg-surface)] border border-[var(--tu-border)]/60 rounded-[var(--tu-radius)] transition-all"
                  >
                    <button
                      onClick={() => onToggleTask(task.id)}
                      className="mt-0.5 text-emerald-500 hover:text-[var(--tu-text-muted)] transition-colors cursor-pointer shrink-0"
                      title="Mark task incomplete"
                    >
                      <CheckCircle2 className="w-5 h-5 fill-emerald-500/20" />
                    </button>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-xs text-[var(--tu-text-muted)] line-through">
                          {task.title}
                        </span>
                        <button
                          onClick={() => onDeleteTask(task.id)}
                          className="opacity-0 group-hover:opacity-100 p-1 text-[var(--tu-text-muted)] hover:text-rose-400 transition-all cursor-pointer"
                          title="Delete task"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <span className="text-[11px] text-[var(--tu-text-muted)]">
                        {task.courseName}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
