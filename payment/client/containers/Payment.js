import React, { Component } from 'react';
import { inject } from 'mobx-react';

@inject('payment')
export default class Payment extends Component {

  constructor(props) {
    super(props);
    this.state = { paymentData: props.payment.paymentData };
  }

  onInputChange = (field, event) => {
    console.log('value', event.target.value);
    this.state = { paymentData: { ... this.state.paymentData, [field]: this.state.paymentData[field] + event.target.value }};
  };

  render() {
    const { cardHolder } = this.state.paymentData;
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
                    <form role="form">
                    <div className="form-group">
                        <label htmlFor="cardHolder">
                            Card Holder</label>
                        
                            <input type="text" className="form-control" id="cardHolder" onChange={event => this.onInputChange('cardHolder', event)} value={cardHolder}
                                required autoFocus />
                            
                        

                    </div>
                    <div className="form-group">
                        <label htmlFor="cardNumber">
                            Card Number</label>
                        <div className="input-group">
                            <input type="password" className="form-control" id="cardNumber"
                                required autoFocus />
                            <span className="input-group-addon"><span className="glyphicon glyphicon-lock"></span></span>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-xs-7 col-md-7">
                            <div className="form-group">
                                <label htmlFor="expityMonth">
                                    Expiration Date</label>
                         
                                    <input type="text" className="form-control" id="expityMonth" placeholder="MM/YY" required />
                        
                      
                            </div>
                        </div>
                        <div className="col-xs-5 col-md-5 pull-right">
                            <div className="form-group">
                                <label htmlFor="cvCode">
                                    Security Code</label>
                                <input type="password" className="form-control" id="cvCode" placeholder="CVC" required />
                            </div>
                        </div>
                    </div>
                    </form>
                    <ul className="nav nav-pills nav-stacked">
                      <li className=""><span className="pull-right"><span className="glyphicon glyphicon-usd"></span>4200</span> Total Amount</li>
                    </ul>
                    <br/>
                    <button className="btn btn-success btn-lg btn-block" >Pay</button>
                    <button className="btn btn-lg btn-block" >Cancel</button>
                </div>
            </div>
        </div>
    </div>
</div>;
  }

}


    