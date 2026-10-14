# TU Calendar & Tasks 📅

> **Community Plugin for TU Cockpit**  
> An interactive academic timetable, TUWEL deadlines calendar, and Google Tasks-style assignment checklist for students at TU Wien.

[![TU Cockpit Verified Community](https://img.shields.io/badge/TU%20Cockpit-Verified%20Plugin-006699?style=flat-square)](https://github.com/tu-cockpit-community)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=flat-square)](LICENSE)

---

## ✨ Features

- 🗓️ **Weekly Timetable (Stundenplan):** Clean weekly lecture schedule grid with lecture hall locations (e.g. *Freihaus HS 1*, *Informatikhörsaal*), course categories (VO, UE, VU), and time slots (08:00–20:00).
- ✅ **Google Tasks-Style Checklist (Aufgaben):** Fast, distraction-free deadline management for TUWEL assignments with instant completed checkboxes, overdue alerts, custom task creation, and localStorage persistence.
- 📅 **Academic Calendar Month View:** High-level month grid plotting upcoming submissions, tests, and lecture days.
- 🎨 **Adaptive Theme Syncing:** Natively inherits TU Cockpit's central CSS design tokens (`--tu-bg-base`, `--tu-bg-surface`, `--tu-accent`, `--tu-text-primary`) for seamless dark/light mode consistency.
- ⚡ **Offline & Privacy-First:** Runs locally in a sandboxed iframe with zero telemetry or external server tracking.

---

## 🚀 Installation in TU Cockpit

1. Open **TU Cockpit**.
2. Navigate to the **Community Store** (Marketplace).
3. Search for **TU Calendar & Tasks**.
4. Click **Install Plugin** to start using the calendar in your sidebar!

---

## 🛠️ Local Development

```bash
# Clone the repository
git clone https://github.com/tu-cockpit-community/tu-calendar.git
cd tu-calendar

# Install dependencies
npm install

# Start local development server
npm run dev

# Build production bundle
npm run build
```

---

## 📄 License

MIT © [TU Cockpit Community Contributors](https://github.com/tu-cockpit-community)
