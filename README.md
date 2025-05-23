![image](https://github.com/user-attachments/assets/9654f081-f786-4d08-87dd-8a24dfa429e9)

# System Health Monitor

A cross-platform system utility and admin dashboard to monitor the health of multiple machines.

## 🎯 Objective

This tool:
- Runs as a background system utility (via Electron)
- Performs essential system checks
- Sends updates only when changes occur
- Provides a React-based Admin Dashboard to visualize results

---

## 📦 Project Structure

project/ { public/ (# Static files), src/ { components/ (# UI components), context/ (# React context for state), pages/ (# Settings, Dashboard, Details), electron/ { systemChecks.js (# Performs all checks), reporter.js (# Sends updates) }, main.js (# Electron entrypoint) }, package.json (# Project dependencies), vite.config.ts (# Build config) }

---

## ⚙️ System Utility (Client)

Located in: `src/electron/`

### ✅ Features:
- ✅ Disk Encryption Check
- ✅ OS Update Status
- ✅ Antivirus Presence/Status
- ✅ Inactivity Sleep Timer Check (should be ≤ 10 minutes)
- ✅ Background daemon (every 15–60 min)
- ✅ Only reports data when system status changes
- ✅ Sends updates to remote endpoint
- ✅ Electron ensures cross-platform support

---

## 🧑‍💻 Frontend (Admin Dashboard)

Built with **React + Tailwind + Vite**

### Key UI Components:
- ✅ Machine list with real-time status
- ✅ Visual indicators for issues (badges, flags)
- ✅ Last check-in timestamps
- ✅ Filters & Sorting options

Located in:
- `src/pages/`: Core UI pages like Dashboard and Settings
- `src/components/`: Machine cards, filter bar, status badges

---

## 🚀 Getting Started

### 🔧 Prerequisites

- Node.js (v18+)
- npm

### 📥 Installation

```bash
git clone https://github.com/yourusername/soslphere-system-monitor.git
cd project
npm install

# Start the Electron + React app
npm run dev

