import React from 'react';

export const Row = ({ children, onRowClick }) =>
  <tr>
    <div className="clickable table-row" href="#!" onClick={() => onRowClick }>
      {children}
    </div>
  </tr>;
