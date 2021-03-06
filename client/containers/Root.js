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
import { startListening } from '../socket-listener';
import InvoicesHolder from './Invoice/InvoicesHolder';
import ForgotPassword from './ForgotPassword/ForgotPassword';
import ResetPassword from './ResetPassword/ResetPassword';

@inject('auth')
class Root extends Component {
  constructor(props) {
    super(props);
  }
  handleAuthorization = (url, Component, history) => {
    if (!this.props.auth.isAuthenticated) {
      this.props.auth.setRedirectionUrl(url);
      return <Redirect to="/login" />;
    }
    return <Component history={history}/>;
  };

  render() {
    return (
        <BrowserRouter>
          <div>
            <Switch>
              <Route exact path='/' component={Home} />
              <Route exact path='/eventDetails/:eventId' component={EventDetails} />
              <Route exact path='/register' render={({history}) => <CustomerRegister history={history} />} />
              <Route exact path='/login' component={Login} />
              <Route exact path='/ticketCategoryManagement' render={() => this.handleAuthorization('/ticketCategoryManagement', TicketCategoryManagement)} />
              <Route exact path='/purchase' render={({history}) => this.handleAuthorization('/purchase', Purchase, history)} />
              <Route exact path='/customerDashboard' render={({ history }) => this.handleAuthorization('/customerDashboard', CustomerDashboard, history)} />
              <Route exact path='/invoices' render={() => this.handleAuthorization('/invoices', InvoicesHolder)} />
              <Route exact path='/forgotPassword' render={({history}) => <ForgotPassword history={history} />} />
              <Route exact path='/resetPassword' render={({history}) => <ResetPassword history={history} />} />
            </Switch>
          </div>
        </BrowserRouter>
    );
  }
}

export default Root;