import React, { useEffect, useRef, useState } from 'react';
import { jobQrSvg } from './jobQr';

type Department = 'technical' | 'electrical' | 'mechanical';
type JobStatus = 'open' | 'on-machine' | 'referred' | 'closed';

type Person = { id: string; name: string };
type Shift = {
  personId: string;
  personName: string;
  department: Department;
  machine: string;
  assignedAt: number;
  startedAt: number;
  endedAt: number | null;
};
type Remark = {
  id: string;
  at: number;
  kind: 'text' | 'voice' | 'image' | 'video';
  text?: string;
  url?: string;
  personId: string | null;
  personName: string;
  department: Department | null;
};
type JobCard = {
  id: string;
  machine: string;
  issue: string;
  department: Department | null;
  personId: string | null;
  status: JobStatus;
  createdAt: number;
  shifts: Shift[];
  remarks: Remark[];
  referredFrom: Department | null;
};

const DEPARTMENTS: { id: Department; label: string }[] = [
  { id: 'technical', label: 'Technical' },
  { id: 'electrical', label: 'Electrical' },
  { id: 'mechanical', label: 'Mechanical' },
];

const PEOPLE: Record<Department, Person[]> = {
  technical: [
    { id: 't1', name: 'Ahsan Raza' },
    { id: 't2', name: 'Bilal Khan' },
    { id: 't3', name: 'Farhan Ali' },
  ],
  electrical: [
    { id: 'e1', name: 'Imran Shah' },
    { id: 'e2', name: 'Nadeem Qureshi' },
    { id: 'e3', name: 'Sohail Ahmed' },
  ],
  mechanical: [
    { id: 'm1', name: 'Tariq Mehmood' },
    { id: 'm2', name: 'Usman Ghani' },
    { id: 'm3', name: 'Waseem Akhtar' },
  ],
};

const MACHINES = [
  'BLEACHING-01',
  'BLEACHING-02',
  'MERCERIZE',
  'PAD STEAM DYEING 01',
  'PRINTING UNIT MAIN',
  'REGGIANI-03',
  'STENTER-14 (NEW MONFORTS)',
  'STENTER-19 (RED FLAG)',
  'THERMOSOL DYEING',
  'CANLAR 150',
];

const personName = (id: string | null) => {
  if (!id) return '';
  return Object.values(PEOPLE).flat().find((person) => person.id === id)?.name ?? '';
};

const freePerson = (department: Department, cards: JobCard[], exceptId?: string) =>
  PEOPLE[department].find(
    (person) =>
      !cards.some(
        (card) =>
          card.id !== exceptId &&
          card.personId === person.id &&
          card.status !== 'closed' &&
          card.status !== 'open',
      ),
  );

const spentMs = (card: JobCard, now: number) =>
  card.shifts.reduce((sum, shift) => sum + ((shift.endedAt ?? now) - shift.startedAt), 0);

const departmentLabel = (id: Department | null) =>
  DEPARTMENTS.find((item) => item.id === id)?.label ?? 'Unassigned';

const formatWhen = (ms: number) =>
  new Date(ms).toLocaleString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });

const formatDuration = (ms: number) => {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  const pad = (value: number) => String(value).padStart(2, '0');
  return hours > 0 ? `${hours}:${pad(minutes)}:${pad(seconds)}` : `${pad(minutes)}:${pad(seconds)}`;
};

const statusLabel = (card: JobCard) => {
  if (card.status === 'open') return 'Waiting';
  if (card.status === 'closed') return 'Closed';
  if (card.status === 'referred') return 'Referred';
  if (!card.personId) return 'Waiting for a free person';
  return 'On machine';
};

const assignCard = (card: JobCard, department: Department, cards: JobCard[], now: number, referred: boolean): JobCard => {
  const person = freePerson(department, cards, card.id);
  const shifts = card.shifts.map((shift) => (shift.endedAt === null ? { ...shift, endedAt: now } : shift));
  if (!person) {
    return {
      ...card,
      department,
      personId: null,
      status: referred ? 'referred' : 'open',
      referredFrom: referred ? card.department : card.referredFrom,
      shifts,
    };
  }
  return {
    ...card,
    department,
    personId: person.id,
    status: referred ? 'referred' : 'on-machine',
    referredFrom: referred ? card.department ?? card.referredFrom : card.referredFrom,
    shifts: [
      ...shifts,
      {
        personId: person.id,
        personName: person.name,
        department,
        machine: card.machine,
        assignedAt: now,
        startedAt: now,
        endedAt: null,
      },
    ],
  };
};

const seed = (now: number): JobCard[] => [
  {
    id: 'JC-1041',
    machine: 'BLEACHING-01',
    issue: 'Steamer temperature is running above the set point.',
    department: 'electrical',
    personId: 'e1',
    status: 'on-machine',
    createdAt: now - 18 * 60000,
    referredFrom: null,
    shifts: [
      {
        personId: 'e1',
        personName: 'Imran Shah',
        department: 'electrical',
        machine: 'BLEACHING-01',
        assignedAt: now - 18 * 60000,
        startedAt: now - 12 * 60000,
        endedAt: null,
      },
    ],
    remarks: [
      {
        id: 'r-1041',
        at: now - 8 * 60000,
        kind: 'text',
        text: 'Steam valve is open past the set point. Holding the line while the temperature settles.',
        personId: 'e1',
        personName: 'Imran Shah',
        department: 'electrical',
      },
    ],
  },
  {
    id: 'JC-1042',
    machine: 'REGGIANI-03',
    issue: 'Print head alignment needs a mechanical check.',
    department: null,
    personId: null,
    status: 'open',
    createdAt: now - 4 * 60000,
    referredFrom: null,
    shifts: [],
    remarks: [],
  },
  {
    id: 'JC-1040',
    machine: 'STENTER-14 (NEW MONFORTS)',
    issue: 'Exhaust fan not holding the set speed.',
    department: 'technical',
    personId: 't2',
    status: 'on-machine',
    createdAt: now - 40 * 60000,
    referredFrom: null,
    shifts: [
      {
        personId: 't2',
        personName: 'Bilal Khan',
        department: 'technical',
        machine: 'STENTER-14 (NEW MONFORTS)',
        assignedAt: now - 32 * 60000,
        startedAt: now - 25 * 60000,
        endedAt: null,
      },
    ],
    remarks: [],
  },
  {
    id: 'JC-1039',
    machine: 'PAD STEAM DYEING 01',
    issue: 'Dryer chain tension is uneven.',
    department: 'mechanical',
    personId: 'm2',
    status: 'on-machine',
    createdAt: now - 55 * 60000,
    referredFrom: 'technical',
    shifts: [
      {
        personId: 't3',
        personName: 'Farhan Ali',
        department: 'technical',
        machine: 'PAD STEAM DYEING 01',
        assignedAt: now - 50 * 60000,
        startedAt: now - 44 * 60000,
        endedAt: now - 26 * 60000,
      },
      {
        personId: 'm2',
        personName: 'Usman Ghani',
        department: 'mechanical',
        machine: 'PAD STEAM DYEING 01',
        assignedAt: now - 26 * 60000,
        startedAt: now - 20 * 60000,
        endedAt: null,
      },
    ],
    remarks: [
      {
        id: 'r-1039-a',
        at: now - 30 * 60000,
        kind: 'text',
        text: 'Chain tension is outside the mechanical range. Referring this job to Mechanical.',
        personId: 't3',
        personName: 'Farhan Ali',
        department: 'technical',
      },
      {
        id: 'r-1039-b',
        at: now - 12 * 60000,
        kind: 'text',
        text: 'Dryer chain reset. Watching the next pass before closing the job.',
        personId: 'm2',
        personName: 'Usman Ghani',
        department: 'mechanical',
      },
    ],
  },
];

export const JobCardDashboard: React.FC = () => {
  const [cards, setCards] = useState<JobCard[]>(() => seed(Date.now()));
  const [now, setNow] = useState(() => Date.now());
  const [machine, setMachine] = useState(MACHINES[0]);
  const [issue, setIssue] = useState('');
  const [startDepartment, setStartDepartment] = useState<Department | ''>('');
  const [openId, setOpenId] = useState<string | null>(null);
  const [remark, setRemark] = useState('');
  const [recording, setRecording] = useState(false);
  const [dragOver, setDragOver] = useState<string | null>(null);
  const [showStart, setShowStart] = useState(false);
  const nextNumber = useRef(1043);
  const recorder = useRef<MediaRecorder | null>(null);
  const chunks = useRef<Blob[]>([]);

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 1000);
    return () => window.clearInterval(timer);
  }, []);

  useEffect(() => {
    if (!openId) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setOpenId(null);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [openId]);

  const openCard = cards.find((card) => card.id === openId) ?? null;

  const moveCard = (id: string, department: Department | null, person?: Person) => {
    setCards((current) => {
      const stamp = Date.now();
      return current.map((card) => {
        if (card.id !== id || card.status === 'closed') return card;
        if (!department) {
          return {
            ...card,
            department: null,
            personId: null,
            status: 'open',
            shifts: card.shifts.map((shift) => (shift.endedAt === null ? { ...shift, endedAt: stamp } : shift)),
          };
        }
        if (person) {
          const busy = current.some(
            (other) => other.id !== id && other.personId === person.id && other.status !== 'closed' && other.status !== 'open',
          );
          if (busy) return card;
          const shifts = card.shifts.map((shift) => (shift.endedAt === null ? { ...shift, endedAt: stamp } : shift));
          return {
            ...card,
            department,
            personId: person.id,
            status: card.department && card.department !== department ? 'referred' : 'on-machine',
            referredFrom: card.department && card.department !== department ? card.department : card.referredFrom,
            shifts: [
              ...shifts,
              {
                personId: person.id,
                personName: person.name,
                department,
                machine: card.machine,
                assignedAt: stamp,
                startedAt: stamp,
                endedAt: null,
              },
            ],
          };
        }
        return assignCard(card, department, current, stamp, Boolean(card.department && card.department !== department));
      });
    });
  };

  const startCard = () => {
    const text = issue.trim();
    if (!text) return;
    const id = `JC-${nextNumber.current}`;
    nextNumber.current += 1;
    const created: JobCard = {
      id,
      machine,
      issue: text,
      department: null,
      personId: null,
      status: 'open',
      createdAt: Date.now(),
      shifts: [],
      remarks: [],
      referredFrom: null,
    };
    setCards((current) => {
      const next = [created, ...current];
      if (!startDepartment) return next;
      return next.map((card) => (card.id === id ? assignCard(card, startDepartment, next, Date.now(), false) : card));
    });
    setIssue('');
    setShowStart(false);
    setOpenId(id);
  };

  const closeCard = (id: string) => {
    const stamp = Date.now();
    setCards((current) =>
      current.map((card) =>
        card.id === id
          ? {
              ...card,
              status: 'closed',
              shifts: card.shifts.map((shift) => (shift.endedAt === null ? { ...shift, endedAt: stamp } : shift)),
            }
          : card,
      ),
    );
  };

  const addRemark = (id: string, entry: Omit<Remark, 'id' | 'at' | 'personId' | 'personName' | 'department'>) => {
    setCards((current) =>
      current.map((card) =>
        card.id === id
          ? {
              ...card,
              remarks: [
                ...card.remarks,
                {
                  ...entry,
                  id: `${Date.now()}`,
                  at: Date.now(),
                  personId: card.personId,
                  personName: personName(card.personId) || 'Unassigned',
                  department: card.department,
                },
              ],
            }
          : card,
      ),
    );
  };

  const toggleVoice = async (id: string) => {
    if (recording) {
      recorder.current?.stop();
      setRecording(false);
      return;
    }
    if (!navigator.mediaDevices?.getUserMedia) return;
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const media = new MediaRecorder(stream);
    chunks.current = [];
    media.ondataavailable = (event) => {
      if (event.data.size > 0) chunks.current.push(event.data);
    };
    media.onstop = () => {
      stream.getTracks().forEach((track) => track.stop());
      const blob = new Blob(chunks.current, { type: media.mimeType || 'audio/webm' });
      addRemark(id, { kind: 'voice', url: URL.createObjectURL(blob) });
    };
    recorder.current = media;
    media.start();
    setRecording(true);
  };

  const onFile = (id: string, file: File | undefined) => {
    if (!file) return;
    const kind = file.type.startsWith('video') ? 'video' : 'image';
    addRemark(id, { kind, url: URL.createObjectURL(file), text: file.name });
  };

  const onDrop = (event: React.DragEvent, department: Department | null, person?: Person) => {
    event.preventDefault();
    const id = event.dataTransfer.getData('text/plain');
    setDragOver(null);
    if (id) moveCard(id, department, person);
  };

  const renderCard = (card: JobCard) => {
    const payload = `${card.id}|${card.machine}`.slice(0, 32);
    const people = card.department ? PEOPLE[card.department] : [];
    return (
      <article
        key={card.id}
        className={`job-card${card.status === 'closed' ? ' is-closed' : ''}${openId === card.id ? ' is-open' : ''}`}
        draggable={card.status !== 'closed'}
        onDragStart={(event) => {
          event.dataTransfer.setData('text/plain', card.id);
          event.dataTransfer.effectAllowed = 'move';
        }}
      >
        <div
          className="job-card-top"
          role="button"
          tabIndex={0}
          draggable={card.status !== 'closed'}
          onDragStart={(event) => {
            event.stopPropagation();
            event.dataTransfer.setData('text/plain', card.id);
            event.dataTransfer.effectAllowed = 'move';
          }}
          onClick={() => setOpenId(card.id)}
          onKeyDown={(event) => {
            if (event.key === 'Enter' || event.key === ' ') {
              event.preventDefault();
              setOpenId(card.id);
            }
          }}
        >
          <span className="job-grip" aria-hidden="true" />
          <img className="job-qr" alt="" src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(jobQrSvg(payload, 64))}`} />
          <span className="job-id">{card.id}</span>
          <em className={`job-status is-${card.status}`}>{statusLabel(card)}</em>
        </div>
        <div className="job-card-body">
          <b>{card.issue}</b>
          <p>
            {card.machine}
            {card.status !== 'open' && card.status !== 'closed' ? ` · ${formatDuration(spentMs(card, now))}` : ''}
          </p>
          <footer>
            <label>
              Department
              <select
                value={card.department ?? ''}
                onChange={(event) => {
                  const value = event.target.value as Department | '';
                  moveCard(card.id, value || null);
                }}
                onMouseDown={(event) => event.stopPropagation()}
                disabled={card.status === 'closed'}
              >
                <option value="">Unassigned</option>
                {DEPARTMENTS.map((item) => (
                  <option key={item.id} value={item.id}>{item.label}</option>
                ))}
              </select>
            </label>
            <label>
              By
              <select
                value={card.personId ?? ''}
                onChange={(event) => {
                  const person = people.find((item) => item.id === event.target.value);
                  if (person && card.department) moveCard(card.id, card.department, person);
                }}
                onMouseDown={(event) => event.stopPropagation()}
                disabled={!card.department || card.status === 'closed'}
              >
                <option value="">Unassigned</option>
                {people.map((person) => (
                  <option key={person.id} value={person.id}>{person.name}</option>
                ))}
              </select>
            </label>
          </footer>
        </div>
      </article>
    );
  };

  return (
    <div className="portal-page job-board">
      <div className="portal-page-head">
        <h2>Job Card</h2>
      </div>

      <div className="job-toolbar">
        <p>Start a job, see who is free, and drag the card to Technical, Electrical, or Mechanical.</p>
        <button type="button" className="job-start-btn" onClick={() => setShowStart((open) => !open)}>
          + Start job card
        </button>
      </div>

      {showStart && (
        <form
          className="job-start"
          onSubmit={(event) => {
            event.preventDefault();
            startCard();
          }}
        >
          <label>
            Machine
            <select value={machine} onChange={(event) => setMachine(event.target.value)}>
              {MACHINES.map((item) => (
                <option key={item}>{item}</option>
              ))}
            </select>
          </label>
          <label className="is-grow">
            Job
            <input
              value={issue}
              onChange={(event) => setIssue(event.target.value)}
              placeholder="What needs attention on this machine"
            />
          </label>
          <label>
            Department
            <select value={startDepartment} onChange={(event) => setStartDepartment(event.target.value as Department | '')}>
              <option value="">Leave unassigned</option>
              {DEPARTMENTS.map((item) => (
                <option key={item.id} value={item.id}>{item.label}</option>
              ))}
            </select>
          </label>
          <button type="submit" className="job-start-btn">Create</button>
        </form>
      )}

      <div className="job-columns">
        <section
          className={`job-column${dragOver === 'open' ? ' is-over' : ''}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver('open');
          }}
          onDragLeave={() => setDragOver((current) => (current === 'open' ? null : current))}
          onDrop={(event) => onDrop(event, null)}
        >
          <header>
            <h3>Unassigned <span>{cards.filter((card) => !card.department && card.status !== 'closed').length}</span></h3>
          </header>
          <div className="job-column-cards">
            {cards.filter((card) => !card.department && card.status !== 'closed').map(renderCard)}
            {cards.every((card) => card.department || card.status === 'closed') && (
              <p className="job-empty">No open jobs. Drag a card here to release it.</p>
            )}
          </div>
        </section>
        {DEPARTMENTS.map((department) => {
          const columnCards = cards.filter((card) => card.department === department.id && card.status !== 'closed');
          return (
            <section
              key={department.id}
              className={`job-column${dragOver === department.id ? ' is-over' : ''}`}
              onDragOver={(event) => {
                event.preventDefault();
                setDragOver(department.id);
              }}
              onDragLeave={() => setDragOver((current) => (current === department.id ? null : current))}
              onDrop={(event) => onDrop(event, department.id)}
            >
              <header>
                <h3>{department.label} <span>{columnCards.length}</span></h3>
              </header>
              <div className="job-column-cards">
                {columnCards.map(renderCard)}
                {columnCards.length === 0 && <p className="job-empty">Drag a job card here to assign a free person.</p>}
              </div>
            </section>
          );
        })}
        <section
          className={`job-column is-closed-col${dragOver === 'closed' ? ' is-over' : ''}`}
          onDragOver={(event) => {
            event.preventDefault();
            setDragOver('closed');
          }}
          onDragLeave={() => setDragOver((current) => (current === 'closed' ? null : current))}
          onDrop={(event) => {
            event.preventDefault();
            const id = event.dataTransfer.getData('text/plain');
            setDragOver(null);
            if (id) closeCard(id);
          }}
        >
          <header>
            <h3>Closed <span>{cards.filter((card) => card.status === 'closed').length}</span></h3>
          </header>
          <div className="job-column-cards">
            {cards.filter((card) => card.status === 'closed').map(renderCard)}
            {cards.every((card) => card.status !== 'closed') && <p className="job-empty">No closed jobs.</p>}
          </div>
        </section>
      </div>

      {openCard && (
        <div className="job-modal" onClick={() => setOpenId(null)}>
          <div
            className="job-window"
            role="dialog"
            aria-modal="true"
            aria-labelledby="job-window-title"
            onClick={(event) => event.stopPropagation()}
          >
            <header>
              <div>
                <span>Admin record</span>
                <strong id="job-window-title">{openCard.id}</strong>
              </div>
              <em className={`job-status is-${openCard.status}`}>{statusLabel(openCard)}</em>
              <button type="button" onClick={() => setOpenId(null)} aria-label="Close record">✕</button>
            </header>
            <div className="job-window-scroll">
              <div className="job-window-top">
                <img
                  className="job-qr is-large"
                  alt={`QR for ${openCard.id}`}
                  src={`data:image/svg+xml;charset=utf-8,${encodeURIComponent(jobQrSvg(`${openCard.id}|${openCard.machine}|${openCard.department ?? 'open'}|${personName(openCard.personId)}`.slice(0, 32), 132))}`}
                />
                <div>
                  <p className="job-issue">{openCard.issue}</p>
                  <dl>
                    <div><dt>Machine</dt><dd>{openCard.machine}</dd></div>
                    <div><dt>Department</dt><dd>{departmentLabel(openCard.department)}</dd></div>
                    <div><dt>Person</dt><dd>{openCard.personId ? personName(openCard.personId) : 'Waiting for a free person'}</dd></div>
                    <div>
                      <dt>Referred from</dt>
                      <dd>
                        {openCard.referredFrom
                          ? `${departmentLabel(openCard.referredFrom)}${openCard.shifts.find((shift) => shift.department === openCard.referredFrom) ? ` · ${openCard.shifts.find((shift) => shift.department === openCard.referredFrom)?.personName}` : ''}`
                          : 'Not referred'}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
              <section className="job-window-time">
                <article>
                  <span>Time on machine</span>
                  <strong>{formatDuration(spentMs(openCard, now))}</strong>
                </article>
                <article>
                  <span>Arrived after assignment</span>
                  <strong>
                    {openCard.personId
                      ? formatDuration(
                          openCard.shifts
                            .filter((shift) => shift.personId === openCard.personId)
                            .reduce((sum, shift) => sum + (shift.startedAt - shift.assignedAt), 0),
                        )
                      : '—'}
                  </strong>
                </article>
                <article>
                  <span>Assigned</span>
                  <strong>
                    {openCard.shifts.find((shift) => shift.endedAt === null)
                      ? formatWhen(openCard.shifts.find((shift) => shift.endedAt === null)!.assignedAt)
                      : '—'}
                  </strong>
                </article>
                <article>
                  <span>Arrived</span>
                  <strong>
                    {openCard.shifts.find((shift) => shift.endedAt === null)
                      ? formatWhen(openCard.shifts.find((shift) => shift.endedAt === null)!.startedAt)
                      : '—'}
                  </strong>
                </article>
              </section>
              <section className="job-window-shifts">
                <h4>Who attended this machine</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Person</th>
                      <th>Department</th>
                      <th>Assigned</th>
                      <th>Arrived</th>
                      <th>After assignment</th>
                      <th>Time on machine</th>
                      <th>Referred to</th>
                      <th>Department</th>
                    </tr>
                  </thead>
                  <tbody>
                    {openCard.shifts.map((shift, index) => {
                      const next = openCard.shifts[index + 1];
                      return (
                        <tr key={`${shift.personId}-${shift.assignedAt}`}>
                          <td>{shift.personName}</td>
                          <td>{departmentLabel(shift.department)}</td>
                          <td>{formatWhen(shift.assignedAt)}</td>
                          <td>{formatWhen(shift.startedAt)}</td>
                          <td>{formatDuration(shift.startedAt - shift.assignedAt)}</td>
                          <td>{formatDuration((shift.endedAt ?? now) - shift.startedAt)}{shift.endedAt === null ? ' · live' : ''}</td>
                          <td>{next ? next.personName : '—'}</td>
                          <td>{next ? departmentLabel(next.department) : '—'}</td>
                        </tr>
                      );
                    })}
                    {openCard.shifts.length === 0 && (
                      <tr><td colSpan={8}>No one has been assigned yet.</td></tr>
                    )}
                  </tbody>
                </table>
              </section>
              <section className="job-window-shifts job-remarks">
                <h4>Observations</h4>
                <table>
                  <thead>
                    <tr>
                      <th>Type</th>
                      <th>Person</th>
                      <th>Department</th>
                      <th>Time</th>
                      <th>Observation</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(['text', 'voice', 'image', 'video'] as const).map((kind) => {
                      const entries = openCard.remarks.filter((entry) => entry.kind === kind);
                      const label = kind === 'text' ? 'Written' : kind === 'voice' ? 'Voice' : kind === 'image' ? 'Image' : 'Video';
                      if (entries.length === 0) {
                        return (
                          <tr key={kind}>
                            <td>{label}</td>
                            <td>—</td>
                            <td>—</td>
                            <td>—</td>
                            <td className="job-obs-cell">No {label.toLowerCase()} observation attached.</td>
                          </tr>
                        );
                      }
                      return entries.map((entry) => (
                        <tr key={entry.id}>
                          <td>{label}</td>
                          <td>{entry.personName}</td>
                          <td>{departmentLabel(entry.department)}</td>
                          <td>{formatWhen(entry.at)}</td>
                          <td className="job-obs-cell">
                            {entry.kind === 'text' && entry.text}
                            {entry.kind === 'voice' && entry.url && <audio controls src={entry.url} />}
                            {entry.kind === 'image' && entry.url && <img alt={entry.text || 'Observation'} src={entry.url} />}
                            {entry.kind === 'video' && entry.url && <video controls src={entry.url} />}
                          </td>
                        </tr>
                      ));
                    })}
                  </tbody>
                </table>
                <form
                  onSubmit={(event) => {
                    event.preventDefault();
                    const text = remark.trim();
                    if (!text) return;
                    addRemark(openCard.id, { kind: 'text', text });
                    setRemark('');
                  }}
                >
                  <input
                    value={remark}
                    onChange={(event) => setRemark(event.target.value)}
                    placeholder="Write an observation"
                  />
                  <button type="submit">Send</button>
                  <button type="button" onClick={() => toggleVoice(openCard.id)}>{recording ? 'Stop voice' : 'Voice'}</button>
                  <label className="job-file">
                    Image
                    <input
                      type="file"
                      accept="image/*"
                      onChange={(event) => {
                        onFile(openCard.id, event.target.files?.[0]);
                        event.target.value = '';
                      }}
                    />
                  </label>
                  <label className="job-file">
                    Video
                    <input
                      type="file"
                      accept="video/*"
                      onChange={(event) => {
                        onFile(openCard.id, event.target.files?.[0]);
                        event.target.value = '';
                      }}
                    />
                  </label>
                </form>
              </section>
              <div className="job-refer">
                {DEPARTMENTS.filter((item) => item.id !== openCard.department).map((item) => (
                  <button key={item.id} type="button" onClick={() => moveCard(openCard.id, item.id)}>
                    Refer to {item.label}
                  </button>
                ))}
                {openCard.status !== 'closed' && (
                  <button type="button" className="is-close" onClick={() => closeCard(openCard.id)}>Close job</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
