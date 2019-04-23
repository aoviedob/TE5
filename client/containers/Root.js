import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Header } from 'react-router-dom'
import Home from './Home/Home';
import EventDetails from './EventDetails/EventDetails';
import { inject } from 'mobx-react';

@inject('auth')
class Root extends Component {

  render() {
    /* if(!this.props.auth.isAuthenticated) {
      return <div>Are you lost?</div>
    }*/
    return (
        <BrowserRouter>
          <div>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/eventDetails/:eventId' component={EventDetails} />
            </Switch>
          </div>
        </BrowserRouter>
    );
  }
}

export default Root;