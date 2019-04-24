import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import { Container } from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import './CustomerRegister.css';
import dvr from 'mobx-react-form/lib/validators/DVR';
import MobxReactForm from 'mobx-react-form';
import validatorjs from 'validatorjs';

@inject('customer')
@observer
export default class CustomerRegister extends Component {

  constructor(props) {
    super(props);
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
    
    const hooks = {
      async onSuccess(form) {
        await props.customer.registerCustomer(form.values());
      }
    };

    this.form = new MobxReactForm({ fields }, { plugins, hooks });
  }
 
  render() {
    const errors = this.form.errors();
    
    return (<Container>
        <div className="row">
          <Header></Header>
        </div>
        <div className="register">
                <div className="row">
                    <div className="col-md-3 register-left">
                        <img src="https://image.ibb.co/n7oTvU/logo_white.png" alt=""/>
                        <h3>Welcome</h3>
                        <p>You are 30 seconds away from earning your own money!</p>
                        <input type="submit" name="" value="Login"/><br/>
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