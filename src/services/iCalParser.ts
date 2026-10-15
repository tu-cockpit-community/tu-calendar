import { iCalParsedEvent, DeadlineTask, TimetableEvent, CourseType } from "../types/calendar";

export class ICalParserService {
  /**
   * Parse raw iCalendar (.ics) string into structured events
   */
  static parseIcs(icsData: string): iCalParsedEvent[] {
    const events: iCalParsedEvent[] = [];
    const lines = icsData.replace(/\r\n/g, "\n").replace(/\r/g, "\n").split("\n");

    let currentEvent: Partial<iCalParsedEvent> | null = null;

    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];

      // Unfold folded lines (lines starting with space or tab)
      while (i + 1 < lines.length && (lines[i + 1].startsWith(" ") || lines[i + 1].startsWith("\t"))) {
        line += lines[i + 1].slice(1);
        i++;
      }

      if (line.startsWith("BEGIN:VEVENT")) {
        currentEvent = {};
      } else if (line.startsWith("END:VEVENT") && currentEvent) {
        if (currentEvent.uid && currentEvent.summary && currentEvent.dtstart) {
          events.push(currentEvent as iCalParsedEvent);
        }
        currentEvent = null;
      } else if (currentEvent) {
        const colonIdx = line.indexOf(":");
        if (colonIdx === -1) continue;

        const keyPart = line.slice(0, colonIdx);
        const value = line.slice(colonIdx + 1).trim();
        const key = keyPart.split(";")[0].toUpperCase();

        if (key === "UID") {
          currentEvent.uid = value;
        } else if (key === "SUMMARY") {
          currentEvent.summary = value.replace(/\\,/g, ",").replace(/\\;/g, ";");
        } else if (key === "DTSTART") {
          currentEvent.dtstart = this.parseIcsDate(value);
        } else if (key === "DTEND") {
          currentEvent.dtend = this.parseIcsDate(value);
        } else if (key === "LOCATION") {
          currentEvent.location = value.replace(/\\,/g, ",").replace(/\\;/g, ";");
        } else if (key === "DESCRIPTION") {
          currentEvent.description = value.replace(/\\n/g, "\n").replace(/\\,/g, ",");
        }
      }
    }

    return events;
  }

  /**
   * Convert iCalendar date strings (e.g. 20261015T120000Z or 20261015) to ISO strings
   */
  private static parseIcsDate(dateStr: string): string {
    const clean = dateStr.replace(/[^0-9TZ]/g, "");
    if (clean.length === 8) {
      // YYYYMMDD
      const year = clean.slice(0, 4);
      const month = clean.slice(4, 6);
      const day = clean.slice(6, 8);
      return new Date(`${year}-${month}-${day}T00:00:00Z`).toISOString();
    } else if (clean.length >= 15) {
      // YYYYMMDDTHHMMSS or with Z
      const year = clean.slice(0, 4);
      const month = clean.slice(4, 6);
      const day = clean.slice(6, 8);
      const hour = clean.slice(9, 11);
      const min = clean.slice(11, 13);
      const sec = clean.slice(13, 15);
      return new Date(Date.UTC(+year, +month - 1, +day, +hour, +min, +sec)).toISOString();
    }
    return new Date().toISOString();
  }

  /**
   * Convert parsed iCal events into student DeadlineTasks
   */
  static convertToDeadlineTasks(events: iCalParsedEvent[]): DeadlineTask[] {
    return events.map((ev) => {
      // TUWEL summaries often format as: "Course Name: Assignment Title is due"
      let courseName = "University Course";
      let title = ev.summary;

      if (ev.summary.includes(":")) {
        const parts = ev.summary.split(":");
        courseName = parts[0].trim();
        title = parts.slice(1).join(":").trim();
      }

      return {
        id: ev.uid || `ical_${Math.random().toString(36).slice(2)}`,
        title,
        courseName,
        dueDate: ev.dtstart,
        completed: false,
        source: ev.summary.toLowerCase().includes("tuwel") ? "TUWEL" : "TISS",
        priority: "high",
        notes: ev.description || ev.location,
      };
    });
  }

  /**
   * Convert parsed iCal events into student TimetableEvents (VO, UE, VU, etc.)
   */
  static convertToTimetableEvents(events: iCalParsedEvent[]): TimetableEvent[] {
    const timetableEvents: TimetableEvent[] = [];
    for (const ev of events) {
      if (!ev.dtstart) continue;
      const startDate = new Date(ev.dtstart);
      if (isNaN(startDate.getTime())) continue;

      let dayOfWeek = startDate.getUTCDay();
      if (dayOfWeek === 0) dayOfWeek = 7;
      if (dayOfWeek > 5) continue; // Keep Monday-Friday university schedule

      const startHours = String(startDate.getUTCHours()).padStart(2, "0");
      const startMins = String(startDate.getUTCMinutes()).padStart(2, "0");
      const startTime = `${startHours}:${startMins}`;

      let endTime = "12:00";
      if (ev.dtend) {
        const endDate = new Date(ev.dtend);
        if (!isNaN(endDate.getTime())) {
          const endHours = String(endDate.getUTCHours()).padStart(2, "0");
          const endMins = String(endDate.getUTCMinutes()).padStart(2, "0");
          endTime = `${endHours}:${endMins}`;
        }
      }

      let type: CourseType = "VO";
      const summaryUpper = ev.summary.toUpperCase();
      if (summaryUpper.includes("VU")) type = "VU";
      else if (summaryUpper.includes("UE")) type = "UE";
      else if (summaryUpper.includes("PR")) type = "PR";
      else if (summaryUpper.includes("SE")) type = "SE";

      const courseCodeMatch = ev.summary.match(/\b\d{3}\.[A-Z0-9]{3}\b/);

      timetableEvents.push({
        id: ev.uid || `tt_${Math.random().toString(36).slice(2)}`,
        courseCode: courseCodeMatch ? courseCodeMatch[0] : "180.TUW",
        courseName: ev.summary.replace(/^(VO|UE|VU|PR|SE)\s*/i, "").trim(),
        type,
        room: ev.location || "Online / Campus",
        dayOfWeek,
        startTime,
        endTime,
      });
    }
    return timetableEvents;
  }
}
