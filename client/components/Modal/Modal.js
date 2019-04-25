import React from 'react';

const Modal = ({ id, className, children, modalType }) =>
  	<div className={className}>
      <div id={id} className={modalType}>
      	<div className="modal-content">
          {children}
      	</div>
  	 	</div>
    </div>;


export default Modal;