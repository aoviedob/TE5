import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import dvr from 'mobx-react-form/lib/validators/DVR';
import MobxReactForm from 'mobx-react-form';
import validatorjs from 'validatorjs';

@inject('auth')
@observer
export default class LoginForm extends Component {

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
      rules: 'required|between:6,25',
      placeholder: 'Password *'
    }];
    
    const ctx = this;
    const hooks = {
      async onSuccess(form) {
        const isUserLogged = await props.auth.login(form.values());
        ctx.setState({ isUserLogged, loginClicked: true });
        
        if (isUserLogged) {
          const url = ctx.props.auth.redirectionUrl || '/';
          const { history } = ctx.props;
          if(history) return history.push(url);

          return window.location.href = url;
        }
      }
    };

    this.form = new MobxReactForm({ fields }, { plugins, hooks });
  }

  render() {
    const errors = this.form.errors();
    const { isUserLogged, loginClicked } = this.state;
    const { wide } = this.props;
    
    return (<form role="form" onSubmit={this.form.onSubmit}>
              <div className="tab-content" id="myTabContent">
                <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                  <div className="row register-form">
                    <div className={wide ? 'col-md-12' : 'col-md-6'}>
                      <div className="form-group">
                        <input type="text" className="form-control"  {...this.form.$('email').bind()} />
                        {errors.email && <label className="label label-danger"> {errors.email} </label>}
                        {loginClicked && !isUserLogged && <label className="label label-danger"> Incorrect email or password </label>}
                      </div>
                    </div>
                    <div className={wide ? 'col-md-12' : 'col-md-6'}>
                      <div className="form-group">
                        <input className="form-control"  {...this.form.$('password').bind()} type="password" />
                        {errors.password && <label className="label label-danger"> {errors.password} </label>}
                      </div>
                      <input type="button" className={wide ? 'btn btn-primary btn-block' : 'btnRegister'}  onClick={this.form.onSubmit} value="Login" />
                    </div>
                  </div>
                </div>
              </div>
            </form>);
  }

}