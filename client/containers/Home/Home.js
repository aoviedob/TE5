import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Container } from '../../components/Container/Container';
import SearchBox from '../../components/SearchBox/SearchBox';
import Header from '../../components/Header/Header';
import Slideshow from '../../components/Slideshow/Slideshow';
import Card from '../../components/Card/Card';
import { CardDeck } from '../../components/CardDeck/CardDeck';
import EventFilter from '../EventFilter/EventFilter';

@inject('event')
@observer
export default class Home extends Component {

  goToEventDetails = event => {};
  buyTicket = event => {};

  renderEvents = events => events.map(event =>
                           <Card image={event.coverImg} title={event.title} subtitle={event.subtitle} description={event.description} >
                             <a type="button" onClick={() => this.goToEventDetails(event)} className="btn-floating btn-small btn-fb">View</a>
                             <a type="button" onClick={() => this.buyTicket(event)} className="btn-floating btn-small btn-fb">Buy</a>
                           </Card>);

  onSearch = async word => {
    await this.props.event.searchEvents(word);
  };

  render() {
    const { events } = this.props.event;
  	return <Container>
    		     <div className="row">
    		       <Header></Header>
    		     </div>
    		     <div className="row">
               <div className="col-sm-12">
                 <Slideshow></Slideshow>
               </div>
             </div>
             <div className="row">
    		       <div className="col-sm-10">
                 <SearchBox onSearch={this.onSearch}></SearchBox>
               </div>
               <div className="col-sm-2">
                 <EventFilter></EventFilter>
               </div>
             </div>
             <div className="row">
               <CardDeck>{this.renderEvents(events)}</CardDeck>
             </div>
  	       </Container>;
  }

}