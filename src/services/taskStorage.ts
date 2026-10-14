import { DeadlineTask, TimetableEvent } from "../types/calendar";

const STORAGE_KEY_TASKS = "tu_calendar_tasks_v1";
const STORAGE_KEY_TIMETABLE = "tu_calendar_timetable_v1";

export const DEFAULT_TIMETABLE: TimetableEvent[] = [
  {
    id: "tt_1",
    courseCode: "188.956",
    courseName: "Algorithmen und Datenstrukturen",
    type: "VU",
    room: "Freihaus HS 1",
    dayOfWeek: 1, // Monday
    startTime: "09:15",
    endTime: "11:00",
    lecturer: "Prof. Peitl",
  },
  {
    id: "tt_2",
    courseCode: "104.261",
    courseName: "Analysis 1 für Informatik",
    type: "VO",
    room: "AudiMax",
    dayOfWeek: 1, // Monday
    startTime: "12:15",
    endTime: "14:00",
    lecturer: "Prof. Stufler",
  },
  {
    id: "tt_3",
    courseCode: "185.A48",
    courseName: "Einführung in die Programmierung 1",
    type: "VU",
    room: "Informatikhörsaal (Treitlstraße)",
    dayOfWeek: 2, // Tuesday
    startTime: "10:15",
    endTime: "12:00",
    lecturer: "Prof. Pusch",
  },
  {
    id: "tt_4",
    courseCode: "188.956",
    courseName: "AlgoDat Rechnerübung",
    type: "UE",
    room: "EI 7 (Gußhausstraße)",
    dayOfWeek: 3, // Wednesday
    startTime: "14:00",
    endTime: "16:00",
    lecturer: "Tutorenteam",
  },
  {
    id: "tt_5",
    courseCode: "104.262",
    courseName: "Lineare Algebra für Informatik",
    type: "VO",
    room: "Freihaus HS 2",
    dayOfWeek: 4, // Thursday
    startTime: "08:30",
    endTime: "10:00",
    lecturer: "Prof. Panholzer",
  },
  {
    id: "tt_6",
    courseCode: "184.735",
    courseName: "Datenbanksysteme",
    type: "VU",
    room: "EI 9",
    dayOfWeek: 5, // Friday
    startTime: "10:15",
    endTime: "12:00",
    lecturer: "Prof. Eiter",
  },
];

export const DEFAULT_TASKS: DeadlineTask[] = [
  {
    id: "task_1",
    title: "Übungsblatt 2 - Quicksort & Heapsort Abgabe",
    courseName: "VU Algorithmen und Datenstrukturen",
    dueDate: new Date(Date.now() + 26 * 3600 * 1000).toISOString(), // Tomorrow
    completed: false,
    source: "TUWEL",
    priority: "high",
    notes: "Abgabe im TUWEL als zip mit PDF Protokoll und JUnit Tests.",
  },
  {
    id: "task_2",
    title: "Programmierbeispiel 1 - Java Parser Einreichung",
    courseName: "VU Einführung in die Programmierung 1",
    dueDate: new Date(Date.now() + 4 * 24 * 3600 * 1000).toISOString(),
    completed: false,
    source: "TUWEL",
    priority: "high",
    notes: "Git Repository Push bis 23:55 Uhr.",
  },
  {
    id: "task_3",
    title: "Zwischentest 1 (Freihaus HS 1)",
    courseName: "VO Analysis 1 für Informatik",
    dueDate: new Date(Date.now() + 7 * 24 * 3600 * 1000).toISOString(),
    completed: false,
    source: "TISS",
    priority: "high",
    notes: "Lichtbildausweis und Studierendenausweis mitbringen.",
  },
  {
    id: "task_4",
    title: "SQL Übungsblatt 1 im TUWEL abgeben",
    courseName: "VU Datenbanksysteme",
    dueDate: new Date(Date.now() + 10 * 24 * 3600 * 1000).toISOString(),
    completed: false,
    source: "TUWEL",
    priority: "medium",
  },
  {
    id: "task_5",
    title: "Skriptum Kapitel 3 durcharbeiten",
    courseName: "VO Lineare Algebra",
    dueDate: new Date(Date.now() - 12 * 3600 * 1000).toISOString(), // Completed
    completed: true,
    completedAt: new Date(Date.now() - 10 * 3600 * 1000).toISOString(),
    source: "CUSTOM",
    priority: "low",
  },
];

export class TaskStorageService {
  static getTasks(): DeadlineTask[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_TASKS);
      if (!raw) {
        this.saveTasks(DEFAULT_TASKS);
        return DEFAULT_TASKS;
      }
      return JSON.parse(raw);
    } catch {
      return DEFAULT_TASKS;
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
        this.saveTimetable(DEFAULT_TIMETABLE);
        return DEFAULT_TIMETABLE;
      }
      return JSON.parse(raw);
    } catch {
      return DEFAULT_TIMETABLE;
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
