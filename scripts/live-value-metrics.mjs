import fs from 'fs';
import path from 'path';

const root = new URL('../src/components/dashboards/', import.meta.url);
const files = [
  'EquipmentDashboards.tsx',
  'PrintingDashboards.tsx',
  'DyeingDashboards.tsx',
  'QualityParametersComparisonDashboard.tsx',
  'BoilersAndUtilitiesDashboard.tsx',
  'ETPNetworkDashboard.tsx',
  'EnergyDashboard.tsx',
];

for (const file of files) {
  const p = new URL(file, root);
  if (!fs.existsSync(p)) continue;
  let s = fs.readFileSync(p, 'utf8');
  if (!s.includes('LiveValue') && s.includes('metric-number')) {
    s = s.replace(
      /import React(?:[^;]*);/,
      (m) => `${m}\nimport { LiveValue } from '../../lib/LiveTelemetry';`,
    );
  }
  let seed = 1;
  const next = s.replace(
    /<span className="metric-number([^"]*)">([0-9][0-9,.\-]*?)<\/span>/g,
    (m, extra, num) => {
      const v = parseFloat(num.replace(/,/g, ''));
      if (!Number.isFinite(v)) return m;
      const amp = Math.max(Math.abs(v) * 0.008, 0.05);
      const frac = num.split('.')[1] ?? '';
      const d = frac.length ? Math.min(frac.length, 2) : 0;
      return `<LiveValue className="metric-number${extra}" value={${v}} seed={${seed++}} amplitude={${amp.toFixed(4)}} digits={${d}} />`;
    },
  );
  if (next !== s) {
    fs.writeFileSync(p, next);
    console.log(`${file}: ${seed - 1} metrics`);
  }
}
