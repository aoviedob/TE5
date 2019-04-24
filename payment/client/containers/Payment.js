import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import dvr from 'mobx-react-form/lib/validators/DVR';
import MobxReactForm from 'mobx-react-form';
import validatorjs from 'validatorjs';

@inject('payment')
@observer
export default class Payment extends Component {

  constructor(props) {
    super(props);
    const plugins = {
      dvr: dvr(validatorjs)
    };

    const fields = [{
      name: 'cardHolder',
      rules: 'required',
    }, {
      name: 'cardNumber',
      rules: 'required|numeric',
    },
    {
      name: 'expirationDate',
      rules: 'required|string|min:4|max:5',
      placeholder: 'MM/YY',
    },
    {
      name: 'securityCode',
      rules: 'required|numeric',
      placeholder: 'CVC'
    }];
    
    const hooks = {
      async onSuccess(form) {
        await props.payment.pay(form.values());
      }
    };

    this.form = new MobxReactForm({ fields }, { plugins, hooks });
  }


  async componentWillMount() {
  //  await this.props.payment.getAmount();
  }
  
  render() {
    const { amount, result } = this.props.payment;

    const errors = this.form.errors();
    return <div className="container">
    <div className="row">
        <div className="col-xs-12 col-md-4">
            <div className="panel panel-default">
                <div className="panel-heading">
                    <h3 className="panel-title">
                        Payment 
                    </h3>
                </div>
                <div className="panel-body">
                    <form role="form" onSubmit={this.form.onSubmit}>
                    <div className="form-group">
                        <label> Card Holder </label>
                        <input type="text" className="form-control" {...this.form.$('cardHolder').bind()} />
                        {errors.cardHolder && <label className="label label-danger"> {errors.cardHolder} </label>}
                    </div>
                    <div className="form-group">
                        <label htmlFor="cardNumber"> Card Number </label>
                        <div className="input-group">
                            <input className="form-control"  {...this.form.$('cardNumber').bind()}  type="password" />
                            <span className="input-group-addon"><span className="glyphicon glyphicon-lock"></span></span>
                        </div>
                        {errors.cardNumber && <label className="label label-danger"> {errors.cardNumber} </label>}
                    </div>
                    <div className="row">
                        <div className="col-xs-7 col-md-7">
                            <div className="form-group">
                                <label> Expiration Date </label>
                                <input type="text" className="form-control" {...this.form.$('expirationDate').bind()} />
                                {errors.expirationDate && <label className="label label-danger"> {errors.expirationDate} </label>}
                            </div>
                        </div>
                        <div className="col-xs-5 col-md-5 pull-right">
                            <div className="form-group">
                                <label>
                                    Security Code</label>
                                <input className="form-control" required {...this.form.$('securityCode').bind()} type="password" />
                                {errors.securityCode && <label className="label label-danger"> {errors.securityCode} </label>}
                            </div>
                        </div>
                    </div>
                    </form>
                    <ul className="nav nav-pills nav-stacked">
                      <li className=""><span className="pull-right"><span className="glyphicon glyphicon-usd"></span>{amount}</span> Total Amount</li>
                    </ul>
                    <br/>
                    <button type="submit" onClick={this.form.onSubmit} className="btn btn-success btn-lg btn-block" >Pay</button>
                    <button onClick={this.form.onClear} className="btn btn-lg btn-block" >Cancel</button>
                </div>
                       {!!result.isInvalid && <label className="label label-danger"> Your card information is invalid </label>}
            </div>
        </div>
    </div>
</div>;
  }

}


    