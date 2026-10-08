import React, { useEffect, useState } from 'react';
import luckyLogo from '../../assets/lucky-textile-logo.png';
import { jobQrSvg } from './jobQr';

const STAGES = ['GREIGE', 'PRETREATMENT', 'DYEING', 'PRINTING', 'FINISHES', 'FOLDING'] as const;

const FABRICS = ['Cotton', 'Polyester', 'PC Blend', 'Viscose', 'Lycra Cotton'];

const batchQr = (value: string, pixels: number) =>
  `data:image/svg+xml;charset=utf-8,${encodeURIComponent(jobQrSvg(value, pixels))}`;

type StageMark = { source: 'qr' | 'manual'; at: number } | null;

type Batch = {
  number: string;
  fabric: string;
  gsm: number;
  addedAt: number;
  done: number;
  entered: number[];
  finishedAt: number | null;
  updates: StageMark[];
};

const formatDate = (stamp: number) =>
  new Date(stamp).toLocaleDateString([], { day: '2-digit', month: 'short', year: 'numeric' });

const timeline = (addedAt: number, done: number, now: number) => {
  const finished = done >= STAGES.length;
  const end = Math.max(now, addedAt);
  if (!finished && done === 0) return { entered: [addedAt], finishedAt: null as number | null };
  const parts = finished ? STAGES.length : done + 1;
  const span = Math.max(end - addedAt, parts * 60000);
  const entered = Array.from({ length: parts }, (_, index) => addedAt + Math.round((span * index) / parts));
  return { entered, finishedAt: finished ? addedAt + span : null };
};

const minutesOf = (batch: Batch, index: number, now: number) => {
  const finished = batch.done >= STAGES.length;
  const entered = batch.entered?.length ? batch.entered : [batch.addedAt];
  if (finished) {
    if (index >= entered.length) return null;
    const end = index + 1 < entered.length ? entered[index + 1] : batch.finishedAt ?? entered[index];
    return Math.max(0, end - entered[index]);
  }
  if (index > batch.done) return null;
  const start = entered[index] ?? batch.addedAt;
  const end = index === batch.done ? now : entered[index + 1] ?? now;
  return Math.max(0, end - start);
};

const formatMinutes = (ms: number) => `${Math.floor(ms / 60000).toLocaleString()} min`;

const formatWhen = (stamp: number) =>
  new Date(stamp).toLocaleString([], { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });

const emptyUpdates = (): StageMark[] => STAGES.map(() => null);

const marksOf = (batch: Batch) => STAGES.map((_, index) => batch.updates?.[index] ?? null);

const historyUpdates = (entered: number[], done: number, finishedAt: number | null, sources: Array<'qr' | 'manual'>) =>
  STAGES.map((_, index) => {
    if (index >= done) return null;
    const at = index + 1 < entered.length ? entered[index + 1] : finishedAt ?? entered[index];
    return { source: sources[index] ?? 'manual', at };
  });

const seed = (now: number): Batch[] => {
  const cottonStart = now - 5 * 86400000;
  const blendStart = now - 12 * 86400000;
  const blendMinutes = [320, 480, 540, 260, 410, 95];
  const blendEntered: number[] = [];
  blendMinutes.reduce((stamp, minutes) => {
    blendEntered.push(stamp);
    return stamp + minutes * 60000;
  }, blendStart);
  const blendFinished = blendStart + blendMinutes.reduce((sum, minutes) => sum + minutes, 0) * 60000;
  const cottonEntered = [cottonStart, cottonStart + 26 * 3600000, now - 18 * 3600000];
  return [
    {
      number: 'BT-10418',
      fabric: 'Cotton',
      gsm: 180,
      addedAt: cottonStart,
      done: 2,
      entered: cottonEntered,
      finishedAt: null,
      updates: historyUpdates(cottonEntered, 2, null, ['manual', 'qr']),
    },
    {
      number: 'BT-10412',
      fabric: 'PC Blend',
      gsm: 220,
      addedAt: blendStart,
      done: 6,
      entered: blendEntered,
      finishedAt: blendFinished,
      updates: historyUpdates(blendEntered, 6, blendFinished, ['qr', 'manual', 'qr', 'manual', 'qr', 'manual']),
    },
    {
      number: 'BT-10421',
      fabric: 'Viscose',
      gsm: 140,
      addedAt: now - 86400000,
      done: 0,
      entered: [now - 86400000],
      finishedAt: null,
      updates: emptyUpdates(),
    },
  ];
};

const printSticker = (batch: Batch) => {
  const frame = document.createElement('iframe');
  frame.setAttribute('aria-hidden', 'true');
  frame.style.cssText = 'position:fixed;width:0;height:0;border:0;right:0;bottom:0';
  document.body.appendChild(frame);
  const doc = frame.contentDocument;
  if (!doc) {
    frame.remove();
    return;
  }
  const logoSrc = new URL(luckyLogo, window.location.href).href;
  doc.open();
  doc.write(`<!DOCTYPE html><html><head><title>Sticker ${batch.number}</title><style>
    @page { size: 90mm 72mm; margin: 4mm; }
    body { margin: 0; font-family: Arial, sans-serif; color: #0f172a; }
    .sticker { width: 82mm; border: 1.5px solid #5c66c4; border-radius: 3mm; padding: 3mm 4mm; text-align: center; }
    .logo { display: block; width: 26mm; height: auto; margin: 0 auto 1.5mm; }
    svg { width: 28mm; height: 28mm; display: block; margin: 1mm auto; }
    strong { display: block; font-size: 16px; letter-spacing: 0.03em; }
    p { margin: 1mm 0 0; font-size: 11px; }
  </style></head><body><article class="sticker"><img class="logo" src="${logoSrc}" alt="Lucky Textile Mills Limited" />${jobQrSvg(batch.number, 180)}<strong>${batch.number}</strong><p>Added ${formatDate(batch.addedAt)}</p></article></body></html>`);
  doc.close();
  const logo = doc.querySelector('img');
  const print = () => {
    frame.contentWindow?.focus();
    frame.contentWindow?.print();
    window.setTimeout(() => frame.remove(), 1500);
  };
  if (logo && !logo.complete) {
    logo.addEventListener('load', print, { once: true });
    logo.addEventListener('error', print, { once: true });
  } else print();
};

const todayValue = () => {
  const now = new Date();
  const pad = (value: number) => String(value).padStart(2, '0');
  return `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(now.getDate())}`;
};

export const BatchTraceDashboard: React.FC = () => {
  const [batches, setBatches] = useState<Batch[]>(() => seed(Date.now()));
  const [openForm, setOpenForm] = useState(false);
  const [number, setNumber] = useState('');
  const [fabric, setFabric] = useState(FABRICS[0]);
  const [gsm, setGsm] = useState('');
  const [addedOn, setAddedOn] = useState(todayValue);
  const [stage, setStage] = useState<(typeof STAGES)[number] | 'COMPLETED'>(STAGES[0]);
  const [notice, setNotice] = useState('');
  const [openNumber, setOpenNumber] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());
  const [scanning, setScanning] = useState(false);
  const [scanCode, setScanCode] = useState('');
  const [scanNotice, setScanNotice] = useState('');

  const closeRecord = () => {
    setOpenNumber(null);
    setScanning(false);
    setScanCode('');
    setScanNotice('');
  };

  useEffect(() => {
    if (!openNumber) return;
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') closeRecord();
    };
    window.addEventListener('keydown', onKey);
    return () => {
      window.clearInterval(timer);
      window.removeEventListener('keydown', onKey);
    };
  }, [openNumber]);

  const createBatch = () => {
    const batchNumber = number.trim();
    const cloth = fabric.trim();
    const weight = Number(gsm);
    if (!batchNumber || !cloth || !Number.isFinite(weight) || weight <= 0 || !addedOn) {
      setNotice('Enter the batch number, fabric name, GSM, and date.');
      return;
    }
    if (batches.some((batch) => batch.number.toLowerCase() === batchNumber.toLowerCase())) {
      setNotice('This batch number is already on the register.');
      return;
    }
    const [year, month, day] = addedOn.split('-').map(Number);
    const addedAt = new Date(year, month - 1, day).getTime();
    const done = stage === 'COMPLETED' ? STAGES.length : STAGES.indexOf(stage);
    const clock = Date.now();
    const { entered, finishedAt } = timeline(addedAt, done, clock);
    const updates = historyUpdates(entered, done, finishedAt, STAGES.map(() => 'manual'));
    const next = { number: batchNumber, fabric: cloth, gsm: weight, addedAt, done, entered, finishedAt, updates };
    setBatches((current) =>
      current.some((batch) => batch.number.toLowerCase() === batchNumber.toLowerCase()) ? current : [next, ...current],
    );
    setNumber('');
    setFabric(FABRICS[0]);
    setGsm('');
    setAddedOn(todayValue());
    setStage(STAGES[0]);
    setNotice('');
    setOpenForm(false);
  };

  const advance = (batchNumber: string) => {
    const at = Date.now();
    setBatches((current) =>
      current.map((batch) => {
        if (batch.number !== batchNumber || batch.done >= STAGES.length) return batch;
        const entered = batch.entered?.length ? batch.entered : timeline(batch.addedAt, batch.done, at).entered;
        const updates = marksOf(batch);
        if (!updates[batch.done]) updates[batch.done] = { source: 'manual', at };
        const done = batch.done + 1;
        if (done >= STAGES.length) return { ...batch, done, entered, finishedAt: at, updates };
        return { ...batch, done, entered: [...entered, at], finishedAt: null, updates };
      }),
    );
  };

  const markStage = (batchNumber: string, source: 'qr' | 'manual') => {
    const at = Date.now();
    setBatches((current) =>
      current.map((batch) => {
        if (batch.number !== batchNumber || batch.done >= STAGES.length) return batch;
        const updates = marksOf(batch);
        updates[batch.done] = { source, at };
        return { ...batch, updates };
      }),
    );
    setScanning(false);
    setScanCode('');
    setScanNotice('');
  };

  const applyScan = (batchNumber: string) => {
    if (scanCode.trim().toLowerCase() !== batchNumber.toLowerCase()) {
      setScanNotice('This scan does not match this batch.');
      return;
    }
    markStage(batchNumber, 'qr');
  };

  const openBatch = batches.find((batch) => batch.number === openNumber) ?? null;

  return (
    <div className="portal-page batch-board">
      <div className="portal-page-head">
        <h2>Batch Traceability</h2>
      </div>
      <div className="batch-create-bar">
        <button type="button" onClick={() => { setNotice(''); setOpenForm((open) => !open); }}>Create batch barcode</button>
      </div>
      {openForm && (
        <form
          className="batch-create"
          onSubmit={(event) => {
            event.preventDefault();
            createBatch();
          }}
        >
          <label>
            Batch number
            <input value={number} onChange={(event) => { setNotice(''); setNumber(event.target.value); }} placeholder="BT-10430" />
          </label>
          <label>
            Fabric type
            <input
              list="batch-fabric-names"
              value={fabric}
              placeholder="Type or choose a cloth"
              onChange={(event) => setFabric(event.target.value)}
            />
            <datalist id="batch-fabric-names">
              {FABRICS.map((item) => (
                <option key={item} value={item} />
              ))}
            </datalist>
          </label>
          <label>
            GSM
            <input value={gsm} inputMode="numeric" placeholder="160" onChange={(event) => setGsm(event.target.value.replace(/[^\d.]/g, ''))} />
          </label>
          <label>
            Date added
            <input type="date" value={addedOn} onChange={(event) => setAddedOn(event.target.value)} />
          </label>
          <label>
            Current stage
            <select value={stage} onChange={(event) => setStage(event.target.value as (typeof STAGES)[number] | 'COMPLETED')}>
              {STAGES.map((item) => (
                <option key={item} value={item}>{item}</option>
              ))}
              <option value="COMPLETED">Completed</option>
            </select>
          </label>
          <button type="submit">Save batch</button>
          {notice && <p className="batch-notice">{notice}</p>}
        </form>
      )}
      <div className="batch-table-wrap">
        <table className="portal-table batch-table">
          <thead>
            <tr>
              <th>QR</th>
              <th>Batch number</th>
              <th>Fabric type</th>
              <th>GSM</th>
              <th>Date added</th>
              <th>Stages</th>
              <th>Current status</th>
              <th>Completed</th>
              <th>Action buttons</th>
            </tr>
          </thead>
          <tbody>
            {batches.map((batch) => {
              const finished = batch.done >= STAGES.length;
              const status = finished ? 'Completed' : STAGES[batch.done];
              return (
                <tr key={batch.number}>
                  <td>
                    <button type="button" className="batch-code" onClick={() => setOpenNumber(batch.number)} aria-label={`Open ${batch.number}`}>
                      <img
                        className="batch-barcode"
                        alt=""
                        src={batchQr(batch.number, 112)}
                      />
                    </button>
                  </td>
                  <td><strong>{batch.number}</strong></td>
                  <td>{batch.fabric}</td>
                  <td>{batch.gsm}</td>
                  <td>{formatDate(batch.addedAt)}</td>
                  <td>
                    <div className="batch-stages">
                      {STAGES.map((stage, index) => (
                        <span key={stage} className={index < batch.done ? 'is-done' : index === batch.done ? 'is-current' : ''}>
                          {stage}
                        </span>
                      ))}
                    </div>
                  </td>
                  <td><em className={finished ? 'is-complete' : 'is-live'}>{status}</em></td>
                  <td>{finished ? 'Yes' : 'No'}</td>
                  <td>
                    <div className="batch-actions">
                      <button type="button" className="batch-print-row" onClick={() => printSticker(batch)}>Print sticker</button>
                      {!finished && (
                        <button type="button" onClick={() => advance(batch.number)}>Complete {STAGES[batch.done]}</button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      {openBatch && (
        <div className="job-modal" onClick={closeRecord}>
          <div
            className="job-window batch-record"
            role="dialog"
            aria-modal="true"
            aria-labelledby="batch-window-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <span>Batch record</span>
                <strong id="batch-window-title">{openBatch.number}</strong>
              </div>
              <em className={`job-status ${openBatch.done >= STAGES.length ? 'is-closed' : 'is-on-machine'}`}>
                {openBatch.done >= STAGES.length ? 'Completed' : STAGES[openBatch.done]}
              </em>
              <button type="button" className="batch-print" onClick={() => printSticker(openBatch)}>Print sticker</button>
              <button type="button" onClick={closeRecord} aria-label="Close record">✕</button>
            </header>
            <div className="job-window-scroll">
              <div className="job-window-top">
                <img
                  className="batch-barcode is-large"
                  alt={`QR ${openBatch.number}`}
                  src={batchQr(openBatch.number, 180)}
                />
                <div>
                  <dl>
                    <div><dt>Batch number</dt><dd>{openBatch.number}</dd></div>
                    <div><dt>Fabric type</dt><dd>{openBatch.fabric}</dd></div>
                    <div><dt>GSM</dt><dd>{openBatch.gsm}</dd></div>
                    <div><dt>Date added</dt><dd>{formatDate(openBatch.addedAt)}</dd></div>
                  </dl>
                </div>
              </div>
              <section className="job-window-time">
                <article>
                  <span>Current stage</span>
                  <strong>{openBatch.done >= STAGES.length ? 'Completed' : STAGES[openBatch.done]}</strong>
                </article>
                <article>
                  <span>{openBatch.done >= STAGES.length ? 'Minutes on last stage' : 'Minutes on this stage'}</span>
                  <strong>
                    {openBatch.done >= STAGES.length
                      ? formatMinutes(minutesOf(openBatch, STAGES.length - 1, now) ?? 0)
                      : formatMinutes(minutesOf(openBatch, openBatch.done, now) ?? 0)}
                  </strong>
                </article>
                <article>
                  <span>Minutes so far</span>
                  <strong>
                    {formatMinutes(STAGES.reduce((sum, _, index) => sum + (minutesOf(openBatch, index, now) ?? 0), 0))}
                  </strong>
                </article>
                <article>
                  <span>Completed</span>
                  <strong>{openBatch.done >= STAGES.length ? 'Yes' : 'No'}</strong>
                </article>
              </section>
              <section className="job-window-shifts">
                <h4>Time on each stage</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Stage</th>
                      <th>Cloth</th>
                      <th>GSM</th>
                      <th>Minutes</th>
                      <th>Status</th>
                      <th>Updated by</th>
                    </tr>
                  </thead>
                  <tbody>
                    {STAGES.map((name, index) => {
                      const minutes = minutesOf(openBatch, index, now);
                      const onStage = openBatch.done < STAGES.length && index === openBatch.done;
                      const status = minutes === null ? 'Not started' : onStage ? 'On this stage' : 'Done';
                      const update = marksOf(openBatch)[index];
                      return (
                        <tr key={name}>
                          <td>{name}</td>
                          <td>{openBatch.fabric}</td>
                          <td>{openBatch.gsm}</td>
                          <td>{minutes === null ? '—' : `${formatMinutes(minutes)}${onStage ? ' · live' : ''}`}</td>
                          <td>{status}</td>
                          <td className="batch-mark">
                            {minutes === null ? '—' : update ? (
                              <span className={`batch-mark-pill is-${update.source}`}>
                                {update.source === 'qr' ? 'QR scan' : 'Manual'}
                                <time>{formatWhen(update.at)}</time>
                              </span>
                            ) : onStage && scanning ? (
                              <form
                                className="batch-scan"
                                onSubmit={(event) => {
                                  event.preventDefault();
                                  applyScan(openBatch.number);
                                }}
                              >
                                <input
                                  autoFocus
                                  value={scanCode}
                                  placeholder={openBatch.number}
                                  aria-label="Scan batch QR"
                                  onChange={(event) => { setScanNotice(''); setScanCode(event.target.value); }}
                                />
                                <button type="submit">Apply</button>
                                {scanNotice && <span className="batch-scan-note">{scanNotice}</span>}
                              </form>
                            ) : onStage ? (
                              <span className="batch-mark-actions">
                                <button type="button" className="is-scan" onClick={() => { setScanNotice(''); setScanning(true); }}>Scan QR</button>
                                <button type="button" className="is-manual" onClick={() => markStage(openBatch.number, 'manual')}>Manual</button>
                              </span>
                            ) : '—'}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </section>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
