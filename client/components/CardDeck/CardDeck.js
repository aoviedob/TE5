import React, { Component } from 'react';
import Card from '../Card/Card';

export const CardDeck = ({ children, ...rest }) =>
  <div className="container" {...rest}>
    <div className="card-deck">
        {children}
     </div>
   </div>;

