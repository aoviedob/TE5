import React from 'react';

export const Container = ({children, ...rest}) =><div className="container-fluid" style={{margin: 0, padding: 0 }} {...rest}>
  {children}
</div>;