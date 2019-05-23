import React, { Component } from 'react';
import LoginForm from '../Login/LoginForm';
import { observer, inject } from 'mobx-react';
import UserDetails from '../UserDetails/UserDetails';
import './Header.css';

@inject('auth')
export default class Header extends Component {

  render() {
  	const { auth, history } = this.props;
    return <div className="col-sm-12" style={{ padding: 0, margin: 0 }}>
			  <header className="topbar">
			      <div className="container">
			        <div className="row">
			          <div className="col-sm-12">
			            <ul className="social-network">
			              <li><a className="waves-effect waves-dark" href="#"><i className="fa fa-facebook"></i></a></li>
			              <li><a className="waves-effect waves-dark" href="#"><i className="fa fa-twitter"></i></a></li>
			              <li><a className="waves-effect waves-dark" href="#"><i className="fa fa-linkedin"></i></a></li>
			              <li><a className="waves-effect waves-dark" href="#"><i className="fa fa-pinterest"></i></a></li>
			              <li><a className="waves-effect waves-dark" href="#"><i className="fa fa-google-plus"></i></a></li>
			            </ul>
			          </div>

			        </div>
			      </div>
			  </header>
			  <nav className="navbar navbar-expand-lg navbar-dark mx-background-top-linear">
			    <div className="container">
			      <a className="navbar-brand" style={{ color: 'white' }}> Tickets and Events System</a>
			      <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarResponsive" aria-controls="navbarResponsive" aria-expanded="false" aria-label="Toggle navigation">
			        <span className="navbar-toggler-icon"></span>
			      </button>
			      <div className="collapse navbar-collapse" id="navbarResponsive" style={{ paddingRight: 15, width: '100%' }}>

			        <ul className="navbar-nav ml-auto">

			          <li className="nav-item active">
			            <a className="nav-link" href="/">Home
			              <span className="sr-only">(current)</span>
			            </a>
			          </li>
			          <li className="nav-item active">
			            <a className="nav-link" href="/purchase">Shopping Cart
			              <span className="sr-only">(current)</span>
			            </a>
			          </li>

			          <li className="nav-item active">
			            <a className="nav-link" href="#" data-toggle="dropdown">
			              <i className="material-icons">account_circle</i>
			            </a>
			             <ul style={{ maxWidth: 300 }}className="dropdown-menu dropdown-menu-right mt-2">
	                       <li className="px-3 py-2">
	                       	  {!auth.isAuthenticated &&
	                           [<LoginForm wide={true} history={history}/>,
	                           <div className="form-group text-center">
	                             <small><a href="#" data-toggle="modal" data-target="#modalPassword">Forgot password?</a></small>
	                            </div>,
	                         	<div className="form-group text-center">
	                              <small><a href="/register">Register</a></small>
	                            </div>]
	                           }
	                           {auth.isAuthenticated && <UserDetails/>}
	                        </li>
	                    </ul>
			          </li>

			        </ul>
			      </div>
			    </div>
			  </nav>
			</div>;
  }

}
