import React from 'react';
import { processingMachineGroups } from '../../data/processingMachines';

export const MachineSelect: React.FC<{ value: string; onChange: (id: string) => void }> = ({ value, onChange }) => (
  <label className="machine-select">
    <span>Machine</span>
    <select value={value} onChange={(event) => onChange(event.target.value)} aria-label="Processing machine">
      {processingMachineGroups.map((group) => (
        <optgroup key={group.category} label={group.category}>
          {group.machines.map((machine) => (
            <option key={machine.id} value={machine.id}>
              {machine.name}
            </option>
          ))}
        </optgroup>
      ))}
    </select>
  </label>
);
