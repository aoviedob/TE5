import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Dashboard from '../../components/Dashboard/Dashboard';
import Purchase from '../Purchase/Purchase';
import UserDetails from '../UserDetails/UserDetails';
import CustomerRegister from '../CustomerRegister/CustomerRegister';

inject('event')
export default class CustomerDashboard extends Component {

  renderUserDetails = () => <UserDetails hideActions={true}/>;

  renderNextEvents = () => {
    const { nextEvents } = this.props.event;
    return nextEvents.map((event, index) =>
             <div key={`${event.name}${index}`} className="col-sm-4">
                             <Card className="card-container" image={event.coverImageUrl} title={event.name} subtitle={`${event.addressLine1}${event.addressLine2}`} description={event.metadata.description} >
                               <a className="btn" style={{ marginRight: 10 }} onClick={() => this.goToEventDetails(event)} >
                                 <i class="material-icons icon" style={{ position: 'relative', top: 5 }}>remove_red_eye</i> View
                               </a>
                               <a className="btn" onClick={() => this.buyTicket(event)}>
                                 <i class="material-icons icon" style={{ position: 'relative', top: 5 }}>add_shopping_cart</i>Add to cart
                               </a>
                             </Card>
                           </div>);
  };


  formatDashboardItems = () => [
  	{
  	  name: 'My Profile',
  	  icon: <i className="material-icons">build</i>,
  	  renderComponent: () => <CustomerRegister isProfile={true} />,
  	},
  	{
  	  name: 'My Next Events',
  	  icon: <i className="material-icons">schedule</i>,
  	  renderComponent: () =>
        <CardDeck>{this.renderNextEvents(pagedEvents)}</CardDeck>,
  	},
  	{
  	  name: 'My Purchases',
  	  icon: <i className="material-icons">account_balance_wallet</i>,
  	  renderComponent: <div></div>,
  	},
  	{
  	  name: 'My Shopping Cart',
  	  icon: <i className="material-icons">shopping_cart</i>,
  	  renderComponent: () => <Purchase hideHeader={true}/>,
  	},
  	{
  	  name: 'My Wish List',
  	  icon: <i className="material-icons">star_rate</i>,
  	  renderComponent: <div></div>,
  	},
  	{
  	  name: 'My Coupons',
  	  icon: <i className="material-icons">label_important</i>,
  	  renderComponent: <div></div>,
  	},
  ];

  render() {
    
    return <Dashboard items={this.formatDashboardItems()} renderUserDetails={this.renderUserDetails}/>;

  }

}