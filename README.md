# VMS — Visitor Management System

A comprehensive, production-grade enterprise Visitor Management System (VMS) built with React, TypeScript, and Tailwind CSS.

## Features

- **Visitor Check-In & Operations**:
  - Live visitor status tracking (Checked-In, Expected, Overstayed, Checked-Out).
  - Walk-in immediate registration and pre-registration invitations.
  - Multi-criteria search, status filters, building zone and visit purpose filters.
  - Instant One-Click Check-Out with live dwell duration tracking.
  - CSV export for daily visitor audit logs.

- **Self-Service Kiosk Mode**:
  - Interactive lobby touch-screen kiosk for self-registration.
  - Pre-registered QR / code lookup for express entry.
  - Digital NDA and campus safety protocol sign-off.
  - Self check-out portal.

- **Digital Security Badge Studio**:
  - High-fidelity printable visitor badges with visitor photo, zone color ribbon, QR code, and barcode.
  - Print-ready format suitable for badge printers or adhesive passes.
  - Wi-Fi credentials voucher and security escort tags.

- **Host Employee Directory & Automated Dispatch**:
  - Host directory across departments with live availability status.
  - Automated notification stream recording alerts via Slack, SMS, and Email upon visitor arrival.
  - Direct host pre-invitation workflows.

- **Emergency Evacuation & Roll Call**:
  - Live head-count roster of all currently on-site visitors.
  - 1-click safety officer muster checklist ("Accounted For / Safe").
  - Evacuation drill declaration and SMS broadcast simulation.
  - Printable emergency fire evacuation muster list for first responders.

- **Analytics & Compliance**:
  - Real-time facility occupancy metrics.
  - Hourly check-in volume distribution charts.
  - Visit purpose and host department breakdowns.
  - NDA and security compliance rate monitoring.

## Tech Stack

- **Frontend**: React 18, TypeScript, Tailwind CSS
- **Icons**: Lucide React
- **Build Tool**: Vite
- **Persistence**: LocalStorage with demo data reset capability
