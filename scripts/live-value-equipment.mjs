import fs from 'fs';

const p = new URL('../src/components/dashboards/EquipmentDashboards.tsx', import.meta.url);
let s = fs.readFileSync(p, 'utf8');

if (!s.includes('LiveValue')) {
  s = s.replace(
    "import React from 'react';",
    "import React from 'react';\nimport { LiveValue } from '../../lib/LiveTelemetry';",
  );
}

let seed = 1;
s = s.replace(/<span className="metric-number([^"]*)">([0-9][0-9,.\-]*?)<\/span>/g, (m, extra, num) => {
  const v = parseFloat(num.replace(/,/g, ''));
  if (!Number.isFinite(v)) return m;
  const amp = Math.max(Math.abs(v) * 0.008, 0.05);
  const frac = num.split('.')[1] ?? '';
  const d = frac.length ? Math.min(frac.length, 2) : 0;
  return `<LiveValue className="metric-number${extra}" value={${v}} seed={${seed++}} amplitude={${amp.toFixed(4)}} digits={${d}} />`;
});

fs.writeFileSync(p, s);
console.log(`Updated EquipmentDashboards with ${seed - 1} LiveValue metrics`);
