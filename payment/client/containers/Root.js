import React, { Component } from 'react';
import { BrowserRouter, Route } from 'react-router-dom'
import Payment from './Payment';
import config from '../../config';

class Root extends Component {

  render() {

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