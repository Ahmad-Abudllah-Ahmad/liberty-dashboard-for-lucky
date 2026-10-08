export type ProcessingMachine = {
  id: string;
  name: string;
  category: string;
};

const group = (category: string, names: string[]): ProcessingMachine[] =>
  names.map((name) => ({
    id: `${category}-${name}`
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, ''),
    name,
    category,
  }));

export const processingMachineGroups: { category: string; machines: ProcessingMachine[] }[] = [
  {
    category: 'Printing',
    machines: group('Printing', [
      'Zimmer Printing 01',
      'Zimmer Sample Table',
      'Termo Print',
      'Rotary Engraving',
      'Reggiani Printing',
      'Flat Bed Printing',
      'Flat Bed Sample Table',
      'Flat Bed Color Kitchen',
      'Flat Bed Engraving',
      'Zimmer Printing 02',
      'Digital Printing',
      'New Reggiani Printing',
    ]),
  },
  {
    category: 'Steaming',
    machines: group('Steaming', ['Steam Ager 01 & Oil Boiler', 'Steam Ager 02, Oil Boiler & Lebo Steamer']),
  },
  {
    category: 'Bleaching',
    machines: group('Bleaching', ['Benninger Bleaching', 'Red Flag Bleaching', 'Benninger Bleaching 03']),
  },
  {
    category: 'Mercerizing',
    machines: group('Mercerizing', ['Red Flag Mercerize', 'Benninger Mercerize']),
  },
  {
    category: 'Singeing',
    machines: group('Singeing', ['OSTHOFF Singeing 02', 'Singeing 01', 'Singeing 03 (Pong Kwang)']),
  },
  {
    category: 'Dyeing',
    machines: group('Dyeing', [
      'Pad Thermosol',
      'Benninger Pad Steam 01',
      'Termo Chem',
      'Exhaust Dyeing',
      'Thailand Pad Steam 02',
      'Pad Batch',
      'Sample Pad Steam',
    ]),
  },
  {
    category: 'Stenter',
    machines: group('Stenter', [
      'Stenter 10F (10 Chambers)',
      'Shaoyang Stenter 04 (8 Chambers)',
      'Babcock Stenter (5 Chambers)',
      'Shaoyang Stenter 01 (8 Chambers)',
      'Shaoyang Stenter 03 (8 Chambers)',
      'Shaoyang Stenter 02 (8 Chambers)',
      'Shaoyang Stenter 05 (8 Chambers)',
      'Shaoyang Stenter 06 (8 Chambers)',
      'Shaoyang Stenter 07 (8 Chambers)',
    ]),
  },
  {
    category: 'Finishing',
    machines: group('Finishing', [
      'Tacome',
      'Seer Sucker',
      'Mario Crosta (04 Drum)',
      'Sanforize 01',
      'Lamperti Raising',
      'Kuster Calendar',
      'Rolling, Packing & Fold',
      'Transfer Calender',
      'Shearing Machine',
      'Ferraro Compacting',
      'Sanforize 02',
      'New Mario Crosta Raising (4 Drums)',
      'Mario Crosta (02 Drum)',
      'Mario Crosta (02 Drum, Spain)',
      'New Haining Raising (2 Drum)',
      'Old Haining Raising (2 Drum)',
      'Lafer Peaching 02',
      'Guarneri Calander',
      'Double Fold Machine (Turkey)',
      'Pitching Micro Sand',
    ]),
  },
  {
    category: 'Garment',
    machines: group('Garment', ['Garment Washing 1', 'Garment Washing 2']),
  },
  {
    category: 'Laboratory',
    machines: group('Laboratory', ['Processing Lab']),
  },
  {
    category: 'Utility',
    machines: group('Utility', ['Utility Section', 'Coal Steam Boiler 25 TPH']),
  },
];

export const processingMachines = processingMachineGroups.flatMap((item) => item.machines);

export const machineSeed = (id: string) => {
  let hash = 0;
  for (let index = 0; index < id.length; index += 1) hash = (hash * 33 + id.charCodeAt(index)) >>> 0;
  return hash;
};

export const machineValue = (id: string, base: number, spread: number, digits = 1) => {
  const seed = machineSeed(id);
  const unit = ((seed % 997) * 17 + (seed >>> 10)) % 1000;
  const swing = (unit / 1000 - 0.5) * spread;
  return Number((base + swing).toFixed(digits));
};
