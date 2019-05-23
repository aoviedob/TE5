import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import Dashboard from '../../components/Dashboard/Dashboard';
import Purchase from '../Purchase/Purchase';
import UserDetails from '../UserDetails/UserDetails';
import CustomerRegister from '../CustomerRegister/CustomerRegister';
import { CardDeck } from '../../components/CardDeck/CardDeck';
import Card from '../../components/Card/Card';
import { Pager } from '../../components/Pager/Pager';
import { Page } from '../../components/Pager/Page';
import { Table } from '../../components/Table/Table';
import { Row } from '../../components/Table/Row';
import { Column } from '../../components/Table/Column';

@inject('event', 'customer', 'auth', 'ticket', 'ticketCategory')
@observer
export default class CustomerDashboard extends Component {

  constructor(props) {
    super(props);
    this.state = { profile: null };
  }
  
  pagesChunkSize = 10;

  getAllNextEvents = async customerId => {
    const tickets = await this.props.ticket.getTicketsByCustomerId(customerId);
    if (!tickets.length) return [];
    
    const ticketCategoryIds = tickets.map(({ ticketCategoryId }) => ticketCategoryId);
    
    const ticketCategories = await this.props.ticketCategory.getCategoriesByIds(ticketCategoryIds);
    
    const eventIds = ticketCategories.map(({ externalEventId }) => externalEventId);
    return await this.props.event.getEventByIds(eventIds);
  };

  async componentWillMount() {
    const profile = await this.props.customer.getCustomerByEmail(this.props.auth.email);
    const allNextEvents = await this.getAllNextEvents(profile.id);
    this.setState({ profile, allNextEvents });
  }

  renderUserDetails = () => <UserDetails hideActions={true} light={true}/>;

  goToEventDetails = event => { 
    this.props.event.setSelectedEvent(event);
    this.props.history.push(`/eventDetails/${event.id}`);
  };

  renderNextEvents = (nextEvents) => {
    return nextEvents.map((event, index) =>
             <div key={`${event.name}${index}`} className="col-sm-4">
                             <Card className="card-container" image={event.coverImageUrl} title={event.name} subtitle={`${event.addressLine1}${event.addressLine2}`} description={event.metadata.description} >
                               <a className="btn" style={{ marginRight: 10 }} onClick={() => this.goToEventDetails(event)} >
                                 <i class="material-icons icon" style={{ position: 'relative', top: 5 }}>remove_red_eye</i> View
                               </a>
                             </Card>
                           </div>);
  };

  renderNextEventPages = events => {
    const pagesLength = Math.ceil(events.length/this.pagesChunkSize);
    const pages = [];

    for(let i = 0; i < pagesLength; i++) {
      pages.push(<Page key={`page-${i}-${events[i].name}`} onClick={() => { this.setState({ sliceStart: i * this.pagesChunkSize, sliceEnd: (i + 1) * this.pagesChunkSize }); } }>{i + 1}</Page>);
    }
    return pages;
  };

  getNextEvents = allNextEvents => {
    if (!allNextEvents.length) return [];

    const eventsLength = allNextEvents.length;
    const { sliceStart = 0, sliceEnd = eventsLength } = this.state;
    const finalSliceEnd = eventsLength < sliceEnd ? eventsLength : sliceEnd;
    return allNextEvents.slice(sliceStart, finalSliceEnd);
  };


  renderProfile =  () => { 
    const { profile } = this.state;
    return <CustomerRegister isProfile={true} title={'Profile'} profile={profile}/>
  };

  formatDashboardItems = () => [
  	{
  	  name: 'My Profile',
  	  icon: <i className="material-icons">build</i>,
  	  renderComponent: this.renderProfile,
  	},
  	{
  	  name: 'My Next Events',
  	  icon: <i className="material-icons">schedule</i>,
  	  renderComponent: () => {
        const { profile, allNextEvents } = this.state;
        const nextEvents = this.getNextEvents(allNextEvents);
        return <div>
                 <CardDeck>{this.renderNextEvents(nextEvents)}</CardDeck>
                 <Pager>{this.renderNextEventPages(allNextEvents)}</Pager>
               </div>; 
      },
  	},
  	{
  	  name: 'My Purchases',
  	  icon: <i className="material-icons">account_balance_wallet</i>,
  	  renderComponent: () => <div>
                              {this.state.tickets.length > 0 && 
                                <Table headers={[]}>
                                  {this.renderRows(rows)}
                                </Table>
                              }
                            </div>,
  	},
  	{
  	  name: 'My Shopping Cart',
  	  icon: <i className="material-icons">shopping_cart</i>,
  	  renderComponent: () => <Purchase hideHeader={true}/>,
  	},
  	{
  	  name: 'My Wish List',
  	  icon: <i className="material-icons">favorite</i>,
  	  renderComponent: <div></div>,
  	},
  	{
  	  name: 'My Coupons',
  	  icon: <i className="material-icons">label_important</i>,
  	  renderComponent: <div></div>,
  	},
  ];

  render() {
    const { profile } = this.state;
    return <div>
           {profile &&
             <Dashboard items={this.formatDashboardItems()} renderUserDetails={this.renderUserDetails} activeItem={{ index: 0, renderComponent: this.renderProfile }}/>}
           
           </div>;

  }

}