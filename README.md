# Lucky Textile Group - SCADA & Energy Management Portal

A modern, industrial-grade SCADA (Supervisory Control and Data Acquisition) and energy monitoring dashboard for **Lucky Textile Mills Limited**. Built with **React 19**, **TypeScript**, and **Vite**.

## Features

- **Plant SCADA Monitoring**: Real-time HMI screens for Stenter, Monforts, Pad Steam Dyeing, Reggiani Printing, Mercerizer, Thermosol, and Canlar machines.
- **Energy & Utilities**: Steam flow tracking, moisture analysis, panel temperature telemetry, boiler performance, chillers, water pumps, HVAC, and solar PV.
- **Batch Traceability & QR Tracking**: Real-time QR-based batch status and lifecycle pipeline monitoring from Greige to Folding.
- **Job Card Management**: Digital job card dispatch, machine assignment, progress tracking, and barcode/QR verification.
- **Alarms Management**: Live alarm notifications, prioritization, and acknowledgment workflow.

## Getting Started

### Prerequisites
- Node.js (v18 or higher recommended)
- npm, pnpm, or yarn

### Installation
```bash
npm install
```

### Development
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### Production Build
```bash
npm run build
npm run preview
```

## Deployment

The application is pre-configured for one-click deployment:
- **Vercel**: Pre-configured with `vercel.json` SPA routing rewrites.
- **Netlify**: Pre-configured with `public/_redirects`.
- **Static Hosting**: Ready output generated in the `dist/` directory via `npm run build`.
