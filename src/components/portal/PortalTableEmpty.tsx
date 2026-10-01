import React from 'react';

export const PortalTableEmpty: React.FC<{ colSpan: number; message: string }> = ({ colSpan, message }) => (
  <tr>
    <td colSpan={colSpan} className="empty-table-note">
      {message}
    </td>
  </tr>
);

export const UtilitiesTableToolbar: React.FC<{ meta: string }> = ({ meta }) => (
  <div className="utilities-toolbar">
    <p className="utilities-table-meta">{meta}</p>
    <button type="button" className="btn-excel">
      Excel Export
    </button>
  </div>
);
