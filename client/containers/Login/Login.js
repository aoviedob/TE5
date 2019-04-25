import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Container } from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import './Login.css';
import dvr from 'mobx-react-form/lib/validators/DVR';
import MobxReactForm from 'mobx-react-form';
import validatorjs from 'validatorjs';

@inject('auth')
@observer
export default class Login extends Component {

  constructor(props) {
    super(props);
    this.state = {
      isUserLogged: false,
      loginClicked: false,
    };

    const plugins = {
      dvr: dvr(validatorjs)
    };

    const fields = [
    {
      name: 'email',
      rules: 'required|email',
      placeholder: 'Email *',
    }, {
      name: 'password',
      rules: 'required|between:8,25',
      placeholder: 'Password *'
    }];
    
    const ctx = this;
    const hooks = {
      async onSuccess(form) {
        const isUserLogged = await props.auth.login(form.values());
        ctx.setState({ isUserLogged, loginClicked: true });
      }
    };

    this.form = new MobxReactForm({ fields }, { plugins, hooks });
  }
 
  render() {
    const errors = this.form.errors();
    const { isUserLogged, loginClicked } = this.state;
    
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
                        <form role="form">
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                    <h3 className="register-heading">Login</h3>
                                    <div className="row register-form">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <input type="text" className="form-control"  {...this.form.$('email').bind()} />
                                                {errors.email && <label className="label label-danger"> {errors.email} </label>}
                                                {loginClicked && isUserLogged && <label className="label label-danger"> Incorrect email or password </label>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                           <div className="form-group">
                                                <input className="form-control"  {...this.form.$('password').bind()} type="password" />
                                                {errors.password && <label className="label label-danger"> {errors.password} </label>}
                                            </div>
                                            <input type="submit" className="btnRegister"  onClick={() => this.form.onSubmit} value="Login" />
                                        </div>
                                    </div>
                                </div>
                              
                            </div>
                        </form>
                    </div>
                </div>

            </div>
            </Container>);
  }

}