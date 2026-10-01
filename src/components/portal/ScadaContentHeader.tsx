import React, { useMemo } from 'react';
import { formatPortalAsOf } from '../../lib/liveValue';
import { useTelemetryTick } from '../../lib/LiveTelemetry';

type ScadaContentHeaderProps = {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
};

/** SCADA dashboard page title block aligned with portal “live as of” semantics. */
export const ScadaContentHeader: React.FC<ScadaContentHeaderProps> = ({ title, subtitle, actions }) => {
  const tick = useTelemetryTick();
  const asOf = useMemo(() => formatPortalAsOf(), [tick]);

  return (
    <div className="content-header-row">
      <div>
        <h2>{title}</h2>
        <p className="content-subtitle">{subtitle}</p>
        <p className="content-asof">
          <span className="live-pulse" aria-hidden />
          Last update · {asOf}
        </p>
      </div>
      {actions ? <div className="header-actions-group">{actions}</div> : null}
    </div>
  );
};
