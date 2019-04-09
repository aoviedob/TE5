import React, { Component } from 'react';
import Card from '../Card/Card';

export const CardDeck = ({ children }) =>
  <div className="container">
    <div className="card-deck">
        {children}
     </div>
   </div>;

