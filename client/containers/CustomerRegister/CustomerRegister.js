import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Container } from '../../components/Container/Container';
import Header from '../Header/Header';
import './CustomerRegister.css';
import dvr from 'mobx-react-form/lib/validators/DVR';
import MobxReactForm from 'mobx-react-form';
import validatorjs from 'validatorjs';

@inject('customer')
@observer
export default class CustomerRegister extends Component {

  constructor(props) {
    super(props);
    this.state = {
      unmatchingPasswords: false,
    }
    const plugins = {
      dvr: dvr(validatorjs)
    };

    const fields = [{
      name: 'fullname',
      rules: 'required|string',
      placeholder: 'Fullname *',
    }, {
      name: 'email',
      rules: 'required|email',
      placeholder: 'Email *',
    },
    {
      name: 'phone',
      rules: 'numeric',
      placeholder: 'Phone',
    },
    {
      name: 'alias',
      rules: 'string',
      placeholder: 'Alias'
    }, {
      name: 'password',
      rules: 'required|between:8,25',
      placeholder: 'Password *'
    }, {
      name: 'confirmPassword',
      rules: 'required|between:8,25',
      placeholder: 'Confirm Password *'
    }];
    
    const ctx = this;
    const hooks = {
      async onSuccess(form) {
        const { password, confirmPassword } = form.values();
        if (password !== confirmPassword) {
          return ctx.setState({unmatchingPasswords: true});
        }

        const result = await props.customer.registerCustomer(form.values());
        if (result.error && result.error.status === 409 ) {
           return ctx.setState({userAlreadyExists: true});
        }
        return ctx.props.history.push(`/login`);
      }
    };

    this.form = new MobxReactForm({ fields }, { plugins, hooks });
  }
   
  goToLogin = () => this.props.history.push(`/login`);

  render() {
    const errors = this.form.errors();
    const { unmatchingPasswords, userAlreadyExists } = this.state;
    
    return (<Container className="register-container">
        <div className="row">
          <Header></Header>
        </div>
        <div className="register">
                <div className="row h-100">
                    <div className="col-md-3 register-left">
                        <i className="material-icons" style={{fontSize: 100 }}>account_box</i>
                        <h3>Welcome</h3>
                        <p>You are only one step away from buying great tickets!</p>
                        <input type="submit" name="" value="Login" onClick={() => this.goToLogin()}/><br/>
                    </div>
                    <div className="col-md-9 register-right">
                        <form role="form" onSubmit={this.form.onSubmit}>
                            <div className="tab-content" id="myTabContent">
                                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                                    <h3 className="register-heading">Register as Customer</h3>
                                    <div className="row register-form">
                                        <div className="col-md-6">
                                            <div className="form-group">
                                                <input type="text" className="form-control" {...this.form.$('fullname').bind()} />
                                                {errors.fullname && <label className="label label-danger"> {errors.fullname} </label>}
                                            </div>
                                            <div className="form-group">
                                                <input type="text" className="form-control"  {...this.form.$('email').bind()} />
                                                {errors.email && <label className="label label-danger"> {errors.email} </label>}
                                                {userAlreadyExists && <label className="label label-danger"> User already exists </label>}
                                            </div>
                                             <div className="form-group">
                                                <input type="text" className="form-control"  {...this.form.$('phone').bind()} />
                                                {errors.phone && <label className="label label-danger"> {errors.phone} </label>}
                                            </div>
                                             <div className="form-group">
                                                <input type="text" className="form-control"  {...this.form.$('alias').bind()} value="" />
                                                {errors.alias && <label className="label label-danger"> {errors.alias} </label>}
                                            </div>
                                        </div>
                                        <div className="col-md-6">
                                           <div className="form-group">
                                                <input className="form-control"  {...this.form.$('password').bind()} type="password" />
                                                {errors.password && <label className="label label-danger"> {errors.password} </label>}
                                            </div>
                                            <div className="form-group">
                                                <input className="form-control"   {...this.form.$('confirmPassword').bind()} type="password" />
                                                {errors.confirmPassword && <label className="label label-danger"> {errors.confirmPassword} </label>}
                                                {unmatchingPasswords && <label className="label label-danger"> Passwords must match </label>}
                                            </div>
                                            <input type="submit" className="btnRegister"  onClick={() => this.form.onSubmit} value="Register" />
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