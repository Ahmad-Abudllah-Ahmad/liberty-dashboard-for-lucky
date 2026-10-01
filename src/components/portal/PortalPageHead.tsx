import React, { useMemo } from 'react';
import { formatPortalAsOf } from '../../lib/liveValue';
import { useTelemetryTick } from '../../lib/LiveTelemetry';

type PortalPageHeadProps = {
  title: string;
  crumb: string;
  /** Live date/time stamp (portal reference style). */
  showLiveAsOf?: boolean;
  /** Energy-style: title left, crumb + as-of stacked on the right. */
  layout?: 'inline' | 'split';
  metaExtra?: React.ReactNode;
};

export const PortalPageHead: React.FC<PortalPageHeadProps> = ({
  title,
  crumb,
  showLiveAsOf = true,
  layout = 'inline',
  metaExtra,
}) => {
  const tick = useTelemetryTick();
  const asOf = useMemo(() => formatPortalAsOf(), [tick]);

  const asOfLine = showLiveAsOf ? (
    <p className="portal-asof">
      <span className="live-pulse" aria-hidden />
      {asOf}
    </p>
  ) : null;

  if (layout === 'split') {
    return (
      <div className="portal-page-head portal-page-head-split">
        <h2>{title}</h2>
        <div className="portal-head-meta">
          <p className="portal-crumb">{crumb}</p>
          {metaExtra}
          {asOfLine}
        </div>
      </div>
    );
  }

  return (
    <div className="portal-page-head">
      <div className="portal-page-head-main">
        <h2>{title}</h2>
        <p className="portal-crumb">{crumb}</p>
      </div>
      <div className="portal-head-meta">
        {metaExtra}
        {asOfLine}
      </div>
    </div>
  );
};
