import { DeadlineTask, TimetableEvent } from "../types/calendar";

const STORAGE_KEY_TASKS = "tu_calendar_tasks_v1";
const STORAGE_KEY_TIMETABLE = "tu_calendar_timetable_v1";

export const DEFAULT_TIMETABLE: TimetableEvent[] = [];
export const DEFAULT_TASKS: DeadlineTask[] = [];

export class TaskStorageService {
  static getTasks(): DeadlineTask[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TASKS);
      if (!raw) {
        return [];
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveTasks(tasks: DeadlineTask[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_TASKS, JSON.stringify(tasks));
    } catch (err) {
      console.warn("Failed to persist tasks to localStorage:", err);
    }
  }

  static toggleTask(id: string): DeadlineTask[] {
    const tasks = this.getTasks();
    const updated = tasks.map((t) => {
      if (t.id === id) {
        const nextState = !t.completed;
        return {
          ...t,
          completed: nextState,
          completedAt: nextState ? new Date().toISOString() : undefined,
        };
      }
      return t;
    });
    this.saveTasks(updated);
    return updated;
  }

  static addTask(task: Omit<DeadlineTask, "id" | "completed">): DeadlineTask[] {
    const tasks = this.getTasks();
    const newTask: DeadlineTask = {
      ...task,
      id: `task_${Date.now()}_${Math.random().toString(36).slice(2, 6)}`,
      completed: false,
    };
    const updated = [newTask, ...tasks];
    this.saveTasks(updated);
    return updated;
  }

  static deleteTask(id: string): DeadlineTask[] {
    const tasks = this.getTasks();
    const updated = tasks.filter((t) => t.id !== id);
    this.saveTasks(updated);
    return updated;
  }

  static getTimetable(): TimetableEvent[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TIMETABLE);
      if (!raw) {
        return [];
      }
      return JSON.parse(raw);
    } catch {
      return [];
    }
  }

  static saveTimetable(events: TimetableEvent[]): void {
    try {
      localStorage.setItem(STORAGE_KEY_TIMETABLE, JSON.stringify(events));
    } catch (err) {
      console.warn("Failed to persist timetable to localStorage:", err);
    }
  }
}
