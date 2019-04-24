import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Container } from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Slideshow from '../../components/Slideshow/Slideshow';
import Card from '../../components/Card/Card';
import { CardDeck } from '../../components/CardDeck/CardDeck';
import EventFilter from '../EventFilter/EventFilter';
import './Home.css';
import { Pager } from '../../components/Pager/Pager';
import { Page } from '../../components/Pager/Page';

@inject('event')
@observer
export default class Home extends Component {
  pagesChunkSize = 9;
  
  constructor(props) {
    super(props);
    this.state = {
      categoryId: null,
      organizerId: null,
      word: null,
      sliceEnd: this.pagesChunkSize,
    }
  }

  async componentWillMount() {
    await this.props.event.getAllEvents(20);
  }

  goToEventDetails = event => { 
    this.props.event.setSelectedEvent(event);
    this.props.history.push(`/eventDetails/${event.id}`);
  };
  
  buyTicket = event => {};

  renderEvents = events => events.map((event, index) =>
                           <div key={`${event.name}${index}`} className="col-sm-4">
                             <Card className="card-container" image={event.coverImageUrl} title={event.name} subtitle={`${event.addressLine1}${event.addressLine2}`} description={event.metadata.description} >
                               <a type="button" className="btn btn-success card-actions" onClick={() => this.goToEventDetails(event)} >View</a>
                               <a type="button" onClick={() => this.buyTicket(event)} className="btn-floating btn-small btn-fb">Buy</a>
                             </Card>
                           </div>);

  searchEvents = async () => {
    const { categoryId, organizerId, word } = this.state;
    await this.props.event.searchEvents(word, { limit: 40, categoryId, organizerId });
  }
  onSearch = word => {
    this.setState({ word }, async () => await this.searchEvents());
  };

  onCategorySelected = ({ id: categoryId}) => {
    this.setState({ categoryId }, async () => await this.searchEvents());
  };

  onOrganizerSelected = ({ id: organizerId}) => {
    this.setState({ organizerId }, async () => await this.searchEvents());
  };

  getPagedEvents = () => {
    const { events = [] } = this.props.event;
    
    const eventsLength = events.length;
    const { sliceStart = 0, sliceEnd = eventsLength } = this.state;
    const finalSliceEnd = eventsLength < sliceEnd ? eventsLength : sliceEnd;
    return events.slice(sliceStart, finalSliceEnd);
  };

  renderPages = events => {
    const pagesLength = Math.ceil(events.length/this.pagesChunkSize);
    const pages = [];

    for(let i = 0; i < pagesLength; i++) {
      pages.push(<Page key={`page-${i}-${events[i].name}`} onClick={() => { this.setState({ sliceStart: i * this.pagesChunkSize, sliceEnd: (i + 1) * this.pagesChunkSize }); } }>{i + 1}</Page>);
    }
    return pages;
  };

  getSlideShowItems = () => {
    const { events = [] } = this.props.event;
    const end = events.length > 3 ? 3 : events.length;
    return events.slice(0, end).map(event => ({ src: event.coverImageUrl }));
  };

  render() {
    const { events = [] } = this.props.event;
    const pagedEvents = this.getPagedEvents();

  	return <Container className="home-container">
    		     <div className="row">
    		       <Header></Header>
    		     </div>
    		     <div className="row">
               <div className="col-sm-12">
                 <Slideshow items={this.getSlideShowItems()}></Slideshow>
               </div>
             </div>
             <div className="row">
    		       <div className="col-sm-12">
                 <EventFilter onSearch={this.onSearch} onCategorySelected={this.onCategorySelected}  onOrganizerSelected={this.onOrganizerSelected}/>
               </div>
             </div>
             <div className="row">
               <div className="col-sm-12 card-deck-container">
                 <CardDeck>{this.renderEvents(pagedEvents)}</CardDeck>
               </div>
             </div>
             <div className="row justify-content-center pages">
                <Pager>{this.renderPages(events)}</Pager>
             </div>
  	       </Container>;
  }

}