import { useEffect, useState } from 'react';

/** Bumps on an interval so demo figures drift instead of sitting frozen. */
export function useLiveTick(ms = 2200): number {
  const [tick, setTick] = useState(0);
  useEffect(() => {
    const id = window.setInterval(() => setTick((n) => n + 1), ms);
    return () => window.clearInterval(id);
  }, [ms]);
  return tick;
}

export function wobble(base: number, tick: number, amplitude: number, seed = 0): number {
  const wave =
    Math.sin(tick * 0.65 + seed) * amplitude +
    Math.cos(tick * 0.31 + seed * 1.7) * amplitude * 0.35;
  return Math.max(0, base + wave);
}

export function parseReading(value: string | number | undefined): number | null {
  if (typeof value === 'number') return Number.isFinite(value) ? value : null;
  if (typeof value !== 'string') return null;
  const cleaned = value.replace(/,/g, '').trim();
  if (!/^-?\d+(\.\d+)?$/.test(cleaned)) return null;
  return Number(cleaned);
}

export function formatLike(original: string | number, next: number): string | number {
  if (typeof original === 'number') {
    const decimals = String(original).includes('.') ? String(original).split('.')[1].length : 0;
    return Number(next.toFixed(Math.min(decimals, 2)));
  }
  const fraction = original.split('.')[1]?.replace(/[^\d]/g, '') ?? '';
  const decimals = Math.min(fraction.length, 2);
  return next.toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/** Live portal header stamp (local date + time). */
export function formatPortalAsOf(date = new Date()): string {
  const datePart = date.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
  const timePart = date.toLocaleTimeString(undefined, {
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  });
  return `${datePart} · ${timePart}`;
}

export function formatNumber(value: number, digits = 2): string {
  return value.toLocaleString('en-US', {
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  });
}
