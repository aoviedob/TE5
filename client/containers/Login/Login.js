import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Container } from '../../components/Container/Container';
import Header from '../Header/Header';
import './Login.css';
import LoginForm from './LoginForm';

@inject('auth')
@observer
export default class Login extends Component {

  constructor(props) {
    super(props);
  }

  componentWillMount() {
    if(this.props.auth.isAuthenticated) this.props.history.push('/');
  }
 
  render() {
    
    return (<Container className="register-container">
              <div className="row">
                <Header></Header>
              </div>
              <div className="register">
                <div className="row h-100">
                  <div className="col-md-3 register-left">
                    <i className="material-icons" style={{fontSize: 100 }}>account_box</i>
                    <h3>Welcome Back</h3>
                  </div>
                  <div className="col-md-9 register-right">
                    <h3 className="register-heading">Login</h3>
                    <LoginForm history={this.props.history} />
                  </div>
                </div>
              </div>
            </Container>);
  }

}