import Header from '../Header/Header';
import { Container } from '../../components/Container/Container';
import React, { Component } from 'react';
import { inject } from 'mobx-react';

@inject('auth')
export default class ResetPassword extends Component {
  
  constructor(props) {
  	super(props);

  	this.state = { email: '' };
  }

  async componentWillMount() {
    if (!this.props.auth.temporalToken) {
      this.props.history.push('/');
    }
  }

  handleInputChanged = (event, name) => {
  	this.setState({ [name]: event.target.value });
  };

  onSubmit =  async () => {
  	const { password, confirmPassword } = this.state;

  	if (password !== confirmPassword) {
      return this.setState({ unmatchingPasswords: true });
    }

    if (password.length < 6) {
      return this.setState({ weakPassword: true });
    }
  	await this.props.auth.resetPassword({ password });
  	return this.setState({ passwordWasReset: true });
  	//await this.props.comm.sendEmail({ email: email, template: 'FORGOT_PASSWORD' , data: { fullname, resetLink: `${host}/resetPassword`  } });
  };

  render() {
  	const { password, confirmPassword, unmatchingPasswords, weakPassword, passwordWasReset } = this.state;
	return <Container>
    		    <div className="row">
    		       <Header></Header>
    		    </div>
    		    <div className="row">
						<div className="col-md-4 offset-md-4" style={{marginTop: 20}}>
				            <div className="panel panel-default">
				              <div className="panel-body">
				                <div className="text-center">
				                  <h3><i className="fa fa-lock fa-4x"></i></h3>
				                  <h2 className="text-center">Reset Password</h2>
				                      <p>{ !passwordWasReset ? 'You can reset your password here.' : 'You reset your password successfully' }</p>
				                  {!passwordWasReset && <div className="panel-body">
				    
				                    <form id="register-form" role="form" autoComplete="off" className="form" method="post">
				    
				                      <div className="form-group">
				                        <div className="input-group">
				                          <span className="input-group-addon"><i className="glyphicon glyphicon-envelope color-blue"></i></span>
				                          <input value={password} onChange={event => this.handleInputChanged(event, 'password')} name="password" placeholder="New Password" className="form-control"  type="password"/>
				                        </div>
				                        <div className="input-group">
				                          <span className="input-group-addon"><i className="glyphicon glyphicon-envelope color-blue"></i></span>
				                          <input value={confirmPassword} onChange={event => this.handleInputChanged(event, 'confirmPassword')} name="confirmPassword" placeholder="Confirm Password" className="form-control"  type="password"/>
				                        </div>
				                        {!weakPassword && unmatchingPasswords && <label className="label label-danger"> Passwords must match </label>}
				                        {weakPassword && <label className="label label-danger"> The field must be between 6 and 25.</label>}
				                      </div>
				                      <div className="form-group">
				                        <input name="recover-submit" className="btn btn-lg btn-primary btn-block" value="Reset Password" onClick={() => this.onSubmit()}/>
				                      </div>
				                    </form>
				    
				                  </div>}
				                </div>
				              </div>
				            </div>
				          </div>
	  </div>
	  </Container>;
  }

}
