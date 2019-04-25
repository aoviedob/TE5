import React from 'react';

export const Container = ({children, ...rest}) =><div className="container-fluid" {...rest}>
  {children}
</div>;