import React, { createContext, useContext, useMemo } from 'react';
import { formatNumber, useLiveTick, wobble } from './liveValue';

const LiveTickContext = createContext(0);

export function LiveTelemetryProvider({
  children,
  intervalMs = 2000,
}: {
  children: React.ReactNode;
  intervalMs?: number;
}) {
  const tick = useLiveTick(intervalMs);
  return <LiveTickContext.Provider value={tick}>{children}</LiveTickContext.Provider>;
}

/** Shared SCADA tick — one interval for the whole app shell. */
export function useTelemetryTick(): number {
  return useContext(LiveTickContext);
}

export function useLiveNumber(
  base: number,
  seed = 0,
  amplitude?: number,
): number {
  const tick = useTelemetryTick();
  const amp = amplitude ?? Math.max(Math.abs(base) * 0.006, 0.04);
  return useMemo(() => wobble(base, tick, amp, seed), [base, tick, amp, seed]);
}

type LiveValueProps = {
  value: number;
  seed?: number;
  amplitude?: number;
  digits?: number;
  className?: string;
  suffix?: string;
};

/** Animated telemetry readout (drifting demo values). */
export const LiveValue: React.FC<LiveValueProps> = ({
  value,
  seed = 0,
  amplitude,
  digits = 2,
  className = 'metric-number',
  suffix,
}) => {
  const live = useLiveNumber(value, seed, amplitude);
  return (
    <span className={`${className} live-value`}>
      {formatNumber(live, digits)}
      {suffix}
    </span>
  );
};
