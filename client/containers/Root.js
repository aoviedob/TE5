import React, { Component } from 'react';
import { BrowserRouter, Route, Switch, Header, Redirect } from 'react-router-dom'
import Home from './Home/Home';
import EventDetails from './EventDetails/EventDetails';
import CustomerRegister from './CustomerRegister/CustomerRegister';
import Login from './Login/Login';
import TicketCategoryManagement from './TicketCategoryManagement/TicketCategoryManagement';
import Purchase from './Purchase/Purchase';
import CustomerDashboard from './CustomerDashboard/CustomerDashboard';
import { inject } from 'mobx-react';

@inject('auth')
class Root extends Component {

  render() {
    return (
        <BrowserRouter>
          <div>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/eventDetails/:eventId' component={EventDetails} />
              <Route exact path='/register' component={CustomerRegister} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/ticketCategoryManagement' render={() => { 
                if (!this.props.auth.isAuthenticated) {
                  return <Redirect to="/login" />;
                } else {
                  return <TicketCategoryManagement/>;
                }
              }} />
              <Route exact path='/purchase' render={() => { 
                if (!this.props.auth.isAuthenticated) {
                  return <Redirect to="/login" />;
                } else {
                  return <Purchase/>;
                }
              }} />
              <Route exact path='/customerDashboard' render={() => { 
                if (!this.props.auth.isAuthenticated) {
                  return <Redirect to="/login" />;
                } else {
                  return <CustomerDashboard/>;
                }
              }} />
            </Switch>
          </div>
        </BrowserRouter>
    );
  }
}

export default Root;