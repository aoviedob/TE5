import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import Payment from './Payment';
import { inject } from 'mobx-react';

@inject('auth')
class Root extends Component {

  render() {
    /*if(!this.props.auth.isAuthenticated) {
      return <div>Are you lost?</div>
    }*/
    return (
        <BrowserRouter>
          <div>
            <Route path='/' component={Payment} />
          </div>
        </BrowserRouter>
    );
  }
}

export default Root;