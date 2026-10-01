# What Is This Project?

**Liberty Mills Dashboard** (package name: `liberty-textile-group`) is a front-end web portal for **Liberty Mills Limited** — a textile/industrial plant. It mimics a **SCADA-style** (Supervisory Control and Data Acquisition) and **energy/utilities monitoring** interface used in manufacturing.

Source repository: [liberty-dashboard-for-lucky on GitHub](https://github.com/Ahmad-Abudllah-Ahmad/liberty-dashboard-for-lucky)

---

## Purpose

The app gives operators and managers a single place to browse plant status: dashboards, alarms, boilers, compressors, grid/solar, ETP (effluent treatment), dyeing/printing quality views, and more. It is built as a **React single-page application** with many dedicated screen components that mirror a real industrial monitoring portal.

**Important:** Values, alarms, and machine states come from **mock data** in `src/data/mockPlantData.ts` and related files. There is no live PLC/backend connection in this repo — it is a **UI demo / prototype** you can extend to hook up real APIs later.

---

## Tech stack

| Layer | Choice |
|--------|--------|
| UI | React 19 + TypeScript |
| Build | Vite 8 |
| Icons | lucide-react + custom SVG icons in `src/components/Icons.tsx` |
| Lint | oxlint |

---

## How the app is organized

- **`src/App.tsx`** — Main shell: sidebar navigation, header, breadcrumbs, alarm state, and which dashboard to show.
- **`src/components/Sidebar.tsx`** — Multi-level menu (Dashboard, Printing, Dyeing, Utilities, Boilers, etc.).
- **`src/components/dashboards/`** — Individual views (steam flow, moisture, panel temperature, SCADA-style equipment pages, and shared “portal” pages).
- **`src/data/mockPlantData.ts`** — Navigation structure, sample alarms (~140), and machine/live status data.
- **`src/types/index.ts`** — TypeScript types for navigation, alarms, and plant entities.

Optional **browser chrome simulation** (`BrowserSimulationBar`) can wrap the UI to look like it is running inside a desktop browser frame.

---

## Main functional areas (sidebar)

1. **Dashboard** — Energy gauges, steam flow, moisture, panel temperature.
2. **Printing / Dyeing** — Quality parameters and live monitoring views.
3. **Alarms** — List with acknowledge / acknowledge-all (client-side state only).
4. **Utilities** — Production, lotwise production, stoppage, activity log, machine stoppages.
5. **Boilers & heat exchanger** — Performance, status, and SCADA-style cards.
6. **Plant equipment** — Geneset, compressor, HVAC, chillers, water pumps, solar PV.
7. **Grid** — Grid dashboards and status.
8. **ETP / RO** — Effluent treatment and reverse-osmosis network views.
9. **Devices** — Device grid overview.

The **home** screen shows **Liberty Mills Limited** branding, quick navigation tiles, and optional “Clean Canvas” vs “Plant SCADA Overview” layouts.

---

## Run locally

Dependencies are installed; the dev server uses Vite’s default port:

```bash
npm install   # if needed
npm run dev
```

Open **http://localhost:5173** (also available on your LAN URL shown in the terminal).

Other scripts:

- `npm run build` — Typecheck + production build
- `npm run preview` — Preview the production build
- `npm run lint` — Run oxlint

---

## Summary

This repository is a **Liberty Mills industrial monitoring dashboard prototype**: rich SCADA-like UX for textiles and utilities, implemented in modern React/TypeScript/Vite, fed by **mock plant data** for demonstration and further integration work.
