import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Dashboard from '../../components/Dashboard/Dashboard';
import Purchase from './containers/Purchase/Purchase';
import UserDetails from './containers/UserDetails/UserDetails';
import CustomerRegister from './containers/CustomerRegister/CustomerRegister';

export default class CustomerDashboard extends Component {

  formatDashboardItems = () => [
    {
  	  itemComponent: () => <UserDetails/>
  	},
  	{
  	  name: 'My Profile',
  	  icon: <i class="material-icons">build</i>,
  	  component: <CustomerRegister isProfile={true} />,
  	},
  	{
  	  name: 'My Next Events',
  	  icon: <i class="material-icons">schedule</i>,
  	  component: <div></div>,
  	},
  	{
  	  name: 'My Purchases',
  	  icon: <i class="material-icons">account_balance_wallet</i>,
  	  component: <div></div>,
  	},
  	{
  	  name: 'My Shopping Cart',
  	  icon: <i class="material-icons">shopping_cart</i>,
  	  component: <Purchase/>,
  	},
  	{
  	  name: 'My Wish List',
  	  icon: <i class="material-icons">star_rate</i>,
  	  component: <div></div>,
  	},
  	{
  	  name: 'My Coupons',
  	  icon: <i class="material-icons">label_important</i>,
  	  component: <div></div>,
  	},
  ];

  render() {
    
    return <Dashboard items={this.formatDashboardItems()}/>;

  }

}