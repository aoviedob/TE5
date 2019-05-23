import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import './UserDetails.css';

@inject('auth')
@observer
export default class UserDetails extends Component {

  logOut = () => {
  	this.props.auth.logOut();
  }

  render() {
  	const { auth, hideActions, light } = this.props;
  	const { email, fullname} = auth;
  	const iconStyle = light ? { color: 'white', fontSize: 55 }: { fontSize: 55 };

    return <div className="container">
		     <div className="row">
			   <div className="col-md-12">
			     
				   <div className="d-flex justify-content-center">
					  <i className="material-icons" style={iconStyle}>account_circle</i>
					</div>
				    <div className="profile-usertitle">
					    <div className="profile-usertitle-name">
						  {fullname}
						</div>
						<div className="profile-usertitle-job">
						  {email}
						</div>
					</div>
				   {!hideActions && <div className="row">
					 <div className="col-md-6">
					   <button type="button" onClick={() => { window.location.href = '/customerDashboard'; }} className="btn btn-dark">Dashboard</button>
					 </div>
					 <div className="col-md-6">  
					   <button type="button" className="btn btn-primary" onClick={() => this.logOut()}>Logout</button>
					 </div>
				   </div>}
			     
			    </div>
			  </div>
			</div>;
  }

}

