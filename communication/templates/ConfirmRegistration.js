import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export const ConfirmRegistration =  props => {
    const { fullName } = props;
    return (
      <div className="card" style="width: 18rem;">
        <img className="card-img-top" src="..." alt="Card image cap">
        <div className="card-body">
          <h5 className="card-title">Confirm Registrarion</h5>
          <p className="card-text">{`Hi ${fullName}, you registered to TE5, if it was not you, please contact support@te5.com.`}</p>
        </div>
      </div>
    );
}
