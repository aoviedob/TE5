import React from 'react';
import './List.css';

export const List = ({ children, ...rest }) => <ul className="list-group list-group-flush" {...rest}>{children}</ul>;
