export type CourseType = "VO" | "UE" | "VU" | "PR" | "SE";

export interface TimetableEvent {
  id: string;
  courseCode: string;
  courseName: string;
  type: CourseType;
  room: string;
  dayOfWeek: number; // 1 = Monday ... 5 = Friday
  startTime: string; // "10:15"
  endTime: string;   // "11:45"
  lecturer?: string;
}

export type TaskSource = "TUWEL" | "TISS" | "CUSTOM";
export type TaskPriority = "high" | "medium" | "low";

export interface DeadlineTask {
  id: string;
  title: string;
  courseName: string;
  dueDate: string; // ISO string
  completed: boolean;
  completedAt?: string;
  source: TaskSource;
  priority: TaskPriority;
  notes?: string;
}

export interface iCalParsedEvent {
  uid: string;
  summary: string;
  dtstart: string;
  dtend?: string;
  location?: string;
  description?: string;
}
