const EXP = new Array<number>(256);
const LOG = new Array<number>(256);
(() => {
  let value = 1;
  for (let i = 0; i < 255; i += 1) {
    EXP[i] = value;
    LOG[value] = i;
    value <<= 1;
    if (value >= 256) value ^= 0x11d;
  }
  EXP[255] = EXP[0];
})();

const mul = (a: number, b: number) => (a === 0 || b === 0 ? 0 : EXP[(LOG[a] + LOG[b]) % 255]);

const reedSolomon = (data: number[], eccCount: number) => {
  let generator = [1];
  for (let i = 0; i < eccCount; i += 1) {
    const next = new Array(generator.length + 1).fill(0);
    for (let j = 0; j < generator.length; j += 1) {
      next[j] ^= generator[j];
      next[j + 1] ^= mul(generator[j], EXP[i]);
    }
    generator = next;
  }
  const ecc = new Array(eccCount).fill(0);
  data.forEach((byte) => {
    const factor = byte ^ ecc[0];
    ecc.copyWithin(0, 1);
    ecc[eccCount - 1] = 0;
    if (factor === 0) return;
    for (let i = 0; i < eccCount; i += 1) ecc[i] ^= mul(generator[i + 1], factor);
  });
  return ecc;
};

const dataCodewords = (text: string) => {
  const bytes = Array.from(new TextEncoder().encode(text)).slice(0, 32);
  const bits: number[] = [];
  const push = (value: number, length: number) => {
    for (let i = length - 1; i >= 0; i -= 1) bits.push((value >> i) & 1);
  };
  push(0b0100, 4);
  push(bytes.length, 8);
  bytes.forEach((byte) => push(byte, 8));
  push(0, Math.min(4, 34 * 8 - bits.length));
  while (bits.length % 8 !== 0) bits.push(0);
  const words: number[] = [];
  for (let i = 0; i < bits.length; i += 8) {
    words.push(bits.slice(i, i + 8).reduce((acc, bit) => (acc << 1) | bit, 0));
  }
  const pads = [0xec, 0x11];
  let pad = 0;
  while (words.length < 34) {
    words.push(pads[pad % 2]);
    pad += 1;
  }
  return words;
};

const reserved = (size: number) => {
  const grid = Array.from({ length: size }, () => Array(size).fill(false));
  const mark = (row: number, col: number) => {
    if (row >= 0 && col >= 0 && row < size && col < size) grid[row][col] = true;
  };
  const finder = (row: number, col: number) => {
    for (let y = -1; y <= 7; y += 1) {
      for (let x = -1; x <= 7; x += 1) mark(row + y, col + x);
    }
  };
  finder(0, 0);
  finder(0, size - 7);
  finder(size - 7, 0);
  for (let i = 0; i < size; i += 1) {
    mark(6, i);
    mark(i, 6);
  }
  for (let y = -2; y <= 2; y += 1) {
    for (let x = -2; x <= 2; x += 1) mark(18 + y, 18 + x);
  }
  mark(4 * 2 + 9, 8);
  for (let i = 0; i < 9; i += 1) {
    mark(8, i);
    mark(i, 8);
  }
  for (let i = 0; i < 8; i += 1) {
    mark(8, size - 1 - i);
    mark(size - 1 - i, 8);
  }
  return grid;
};

const formatBits = (mask: number) => {
  let bits = (0b01 << 3) | mask;
  let value = bits << 10;
  const generator = 0b10100110111;
  for (let i = 14; i >= 10; i -= 1) {
    if (((value >> i) & 1) !== 0) value ^= generator << (i - 10);
  }
  bits = ((bits << 10) | value) ^ 0b101010000010010;
  return bits & 0x7fff;
};

export const jobQrSvg = (text: string, pixels = 84) => {
  const size = 25;
  const hold = reserved(size);
  const modules = Array.from({ length: size }, () => Array(size).fill(false));
  const paintFinder = (row: number, col: number) => {
    for (let y = 0; y < 7; y += 1) {
      for (let x = 0; x < 7; x += 1) {
        const edge = y === 0 || x === 0 || y === 6 || x === 6;
        const core = y >= 2 && y <= 4 && x >= 2 && x <= 4;
        modules[row + y][col + x] = edge || core;
      }
    }
  };
  paintFinder(0, 0);
  paintFinder(0, size - 7);
  paintFinder(size - 7, 0);
  for (let i = 0; i < size; i += 1) {
    modules[6][i] = i % 2 === 0;
    modules[i][6] = i % 2 === 0;
  }
  for (let y = -2; y <= 2; y += 1) {
    for (let x = -2; x <= 2; x += 1) {
      const edge = Math.abs(y) === 2 || Math.abs(x) === 2;
      modules[18 + y][18 + x] = edge || (y === 0 && x === 0);
    }
  }
  modules[17][8] = true;

  const words = dataCodewords(text);
  const stream = words.concat(reedSolomon(words, 10));
  const bits = stream.flatMap((word) => Array.from({ length: 8 }, (_, index) => ((word >> (7 - index)) & 1) === 1));
  let bit = 0;
  let upward = true;
  for (let col = size - 1; col > 0; col -= 2) {
    if (col === 6) col -= 1;
    for (let step = 0; step < size; step += 1) {
      const row = upward ? size - 1 - step : step;
      for (const offset of [0, 1]) {
        const x = col - offset;
        if (hold[row][x]) continue;
        const dark = bit < bits.length ? bits[bit] : false;
        bit += 1;
        modules[row][x] = dark !== ((row + x) % 2 === 0);
      }
    }
    upward = !upward;
  }

  const format = formatBits(0);
  const formatBit = (index: number) => ((format >> index) & 1) === 1;
  for (let i = 0; i < 6; i += 1) modules[8][i] = formatBit(i);
  modules[8][7] = formatBit(6);
  modules[8][8] = formatBit(7);
  modules[7][8] = formatBit(8);
  for (let i = 9; i < 15; i += 1) modules[14 - i][8] = formatBit(i);
  for (let i = 0; i < 8; i += 1) modules[size - 1 - i][8] = formatBit(i);
  for (let i = 8; i < 15; i += 1) modules[8][size - 15 + i] = formatBit(i);

  const cell = pixels / (size + 8);
  const rects: string[] = [];
  modules.forEach((row, y) => {
    row.forEach((dark, x) => {
      if (!dark) return;
      rects.push(`<rect x="${(x + 4) * cell}" y="${(y + 4) * cell}" width="${cell}" height="${cell}"/>`);
    });
  });
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${pixels} ${pixels}" width="${pixels}" height="${pixels}" shape-rendering="crispEdges"><rect width="100%" height="100%" fill="#ffffff"/>${rects.join('')}</svg>`;
};
