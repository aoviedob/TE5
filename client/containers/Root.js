import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Header } from 'react-router-dom'
import Home from './Home/Home';
import EventDetails from './EventDetails/EventDetails';
import CustomerRegister from './CustomerRegister/CustomerRegister';
import Login from './Login/Login';
import TicketCategoryManagement from './TicketCategoryManagement/TicketCategoryManagement';
import { inject } from 'mobx-react';

@inject('auth')
class Root extends Component {

  hasRermission = () => {
    const { isAuthenticated } = this.props.auth;
    if (!isAuthenticated) this.props.history.replace('/');
  } 

  render() {
    return (
        <BrowserRouter>
          <div>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/eventDetails/:eventId' component={EventDetails} />
              <Route exact path='/register' component={CustomerRegister} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/ticketCategoryManagement' onEnter={this.hasRermission} component={TicketCategoryManagement} />
            </Switch>
          </div>
        </BrowserRouter>
    );
  }
}

export default Root;