import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export const ResetPassword =  props => {
    const { fullName, resetLink } = props;
    return (
      <div className="card" style="width: 18rem;">
        <img className="card-img-top" src="..." alt="Card image cap">
        <div className="card-body">
          <h5 className="card-title">Reset Password</h5>
          <p className="card-text">{`Hi ${fullName}, please use the below link to reset your password.`}</p>
          <a href={resetLink} className="btn btn-primary">Reset</a>
        </div>
      </div>
    );
}
