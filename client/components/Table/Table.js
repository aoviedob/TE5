import React from 'react';

export const Table = ({ children, headers = [] }) =>
  <table className="table table-bordered">
	<thead>
	  <tr>
	    {headers.map(header => <th scope="col">{header}</th>)}
	  </tr>
	</thead>
	<tbody>
      {children}
    </tbody>
  </table>;
