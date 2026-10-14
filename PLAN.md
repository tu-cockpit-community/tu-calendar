# TU Calendar & Tasks: Development Sprint Plan & Roadmap

> **Repository:** [`tu-cockpit-community/tu-calendar`](https://github.com/tu-cockpit-community/tu-calendar)  
> **Plugin ID:** `tuwien.community.calendar`  
> **Target Platform:** TU Cockpit Sandboxed Plugin (`PluginFrame.tsx`) & Standalone Web App  
> **Tech Stack:** React 19, TypeScript, Lucide Icons, Vite, CSS Custom Properties (`--tu-*`)

---

## 1. Architectural Vision & Core Features

1. **Adaptive Cockpit Theme Syncing:** Utilizes CSS variables defined on the parent document (`--tu-bg-base`, `--tu-bg-surface`, `--tu-bg-card`, `--tu-border`, `--tu-accent`, `--tu-text-primary`, `--tu-text-secondary`) with automatic fallback to standard TU Wien dark/light palette when run standalone.
2. **Weekly Timetable (Stundenplan):** Full Monday–Friday interactive weekly lecture schedule mapping lecture halls (e.g. "Freihaus HS 1", "EI 7", "Informatikhörsaal"), course numbers, and course categories (VO, UE, VU, PR).
3. **Google Tasks-Style Deadlines Checklist (Aufgaben):** High-speed interactive task manager for TUWEL deadlines and student study tasks with instant checkbox toggles, strikethrough completed states, overdue alerts, countdown badges, and localStorage persistence.
4. **Monthly Academic Calendar Grid (Kalender):** Unified monthly visualizer overlaying TUWEL submission dates, TISS exams, and custom deadlines.
5. **iCal Feed Engine:** Support for parsing standard `.ics` exports from TUWEL and TISS with real-time browser caching.

---

## 2. Milestones Roadmap

### Milestone 1: App Shell, Tab Navigation & Adaptive `--tu-*` Theming `[STATUS: COMPLETED ✅]`
- Build main responsive app shell with tabbed switcher:
  - 🗓️ **Timetable** (Stundenplan)
  - 📅 **Calendar** (Monatsansicht)
  - ✅ **Tasks Checklist** (Aufgaben & Deadlines)
- Connect CSS tokens so changing themes in TU Cockpit automatically themes the plugin iframe without reload.

### Milestone 2: Timetable View (Weekly Grid with Lecture Hall Locations) `[STATUS: COMPLETED ✅]`
- Responsive Monday–Friday time slot grid (08:00–20:00).
- Course lecture cards showing course name, code, instructor, and lecture hall location.
- "Today" indicator and quick navigation between calendar weeks.
- Filter by course type (VO, UE, VU).

### Milestone 3: Google Tasks-Style Deadlines Checklist `[STATUS: COMPLETED ✅]`
- Fast, clean task list inspired by Google Tasks.
- Mark items complete with animated checkmark, crossing out the title and moving to collapsible "Completed" section.
- Quick task creation: type a task name, pick an optional due date, press Enter.
- Due date urgency badges: "Overdue", "Due Today", "Due Tomorrow", "In X days".
- Full local persistence via `localStorage` so student checkboxes and custom tasks survive restarts.

### Milestone 4: Full Calendar Grid View & iCal Feed Import `[STATUS: COMPLETED ✅]`
- Comprehensive month view grid with days of the month.
- Color-coded badges for deadlines (TUWEL = Blue/Amber, Exams = Violet, Custom = Emerald).
- Modal / drawer to view event details upon clicking a calendar date cell.
- iCal Feed import configuration input for TUWEL/TISS calendar URLs.
