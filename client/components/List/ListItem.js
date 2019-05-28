import React from 'react';

export const List = ({ id, item, children, ...rest }) => 
  <li className="list-group-item px-0" {...rest}>
    <a className="btn-list-item collapsed a-item" data-toggle="collapse" href={`#item-${id}`} role="button" aria-expanded="true" aria-controls="collapseExample1">
       {item}
    </a>
    <div className="collapse" id={`#item-${id}`}>
      <div className="card card-body mt-2">
        {children}
      </div>
    </div>
  </li>;

