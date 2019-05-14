import React from 'react';

const Modal = ({ id, className, children, modalType, title, onMoldalClosed, contentStyle }) =>
  	
      <div id={id} className={modalType} data-backdrop="static" data-keyboard="false">
      	<div className="modal-dialog modal-dialog-centered modal-lg">
          <div className="modal-content">
        	  <div className="modal-header">
              <h5 className="modal-title">{title}</h5>
                <button onClick={onMoldalClosed} type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
            </div>
    	      <div className="modal-body" style={contentStyle}>
    	        {children}
    	      </div>
        	</div>
        </div>
  	  </div>;
    


export default Modal;