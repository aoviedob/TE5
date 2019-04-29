import React from 'react';

const Modal = ({ id, className, children, modalType, title }) =>
  	
      <div id={id} className={modalType} data-backdrop="static" data-keyboard="false">
      	<div className="modal-content">
      	  <div className="modal-header">
            <h5 className="modal-title">{title}</h5>
              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                <span aria-hidden="true">&times;</span>
              </button>
          </div>
	      <div className="modal-body">
	        {children}
	      </div>
      	</div>
  	  </div>;
    


export default Modal;