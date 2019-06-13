import Header from '../Header/Header';
import { Container } from '../../components/Container/Container';
import React, { Component } from 'react';
import { inject } from 'mobx-react';

@inject('auth')
export default class ForgotPassword extends Component {
  
  constructor(props) {
  	super(props);

  	this.state = { email: '' };
  }

  async componentWillMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/');
    }
  }

  handleEmailChanged = event => {
  	 this.setState({ email: event.target.value });
  };

  onSubmit =  async () => {

  };

  render() {
  	const { email } = this.state;
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
				                  <h2 className="text-center">Forgot Password?</h2>
				                  <p>You can reset your password here.</p>
				                  <div className="panel-body">
				    
				                    <form id="register-form" role="form" autocomplete="off" className="form" method="post">
				    
				                      <div className="form-group">
				                        <div className="input-group">
				                          <span className="input-group-addon"><i className="glyphicon glyphicon-envelope color-blue"></i></span>
				                          <input value={email} onChange={event => this.handleEmailChanged(event)} name="email" placeholder="Email address" className="form-control"  type="email"/>
				                        </div>
				                      </div>
				                      <div className="form-group">
				                        <input name="recover-submit" className="btn btn-lg btn-primary btn-block" value="Reset Password" onClick={() => this.onSubmit()}/>
				                      </div>
				                      
				                      <input type="hidden" className="hide" name="token" id="token" value=""/> 
				                    </form>
				    
				                  </div>
				                </div>
				              </div>
				            </div>
				          </div>
	  </div>
	  </Container>;
  }

}
