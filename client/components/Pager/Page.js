import React from 'react';

export const Page = ({ key, onClick, children }) => 
  <li key={key} className="page-item"><a className="page-link" onClick={onClick}>{children}</a></li>;
