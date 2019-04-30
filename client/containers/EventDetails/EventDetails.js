import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Container } from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import moment from 'moment';
import './EventDetails.css';

@inject('event', 'eventCategory', 'eventOrganizer', 'ticketCategory')
@observer
export default class EventDetails extends Component {

  constructor(props) {
    super(props);
    this.state = {
      eventId: props.match.params.eventId,
      event: null,
      eventCategory: null,
      eventOrganizer: null,
      relatedEvents: []
    };
  }

  updateEventDetails = async(props, state) => {
    const { eventId } = state;
    const event = await props.event.getEvent(eventId);
    const eventOrganizer = await this.props.eventOrganizer.getOrganizer(event.eventOrganizerId);
    const ticketCategories = await this.props.ticketCategory.getCategoriesByEvent(eventId);
    console.log('ticketCategories', ticketCategories);
    
    const events = [];
    events.push(...(await props.event.getEventsByOrganizer(eventOrganizer.id, 4)));
    events.push(...(await props.event.getEventsByCategory(event.eventCategoryId, 4)));
    const relatedEvents = events.reduce((acc, current) => {
      if (acc.some(x => x.id === current.id) || current.id === eventId || acc.length > 3 ) {
        return acc;
      }

      acc.push(current);
      return acc;
    }, []);

    this.setState({ event, eventOrganizer, relatedEvents, ticketCategories });
  }

  async componentWillMount() {
    await this.updateEventDetails(this.props, this.state);
  }

  componentDidMount() {
    window.scrollTo({top: 0, behavior: "smooth"});
  }

  async componentWillUpdate(nextProps, nextState) {
    if(nextState.eventId !== this.state.eventId){
      await this.updateEventDetails(nextProps, nextState);
    }
  }

  onBuyClicked = () => {
    this.props.history.push(`/register`);
  }

  goToRelatedEvent = event => { 
    this.props.event.setSelectedEvent(event);
    this.props.history.push(`/eventDetails/${event.id}`);
    this.setState({ eventId: event.id });
  };

  renderRelatedEvents = relatedEvents => {
    if (!relatedEvents.length) return <div></div>;
    
    return <div>
            <h3 className="my-4">Related Events</h3>
            <div className="row">
              {relatedEvents.map(event =>{
                const { id, coverImageUrl, name } = event;
                return <div key={id} className="col-md-3 col-sm-6 mb-4">
                  <a onClick={() => this.goToRelatedEvent(event)} style={{cursor: 'pointer'}}>
                    <small>{name}</small>
                    <img className="img-fluid" src={coverImageUrl} alt=""/>
                  </a>
                </div>;})}
            </div>
          </div>;
      };

  renderTicketCategories = categories => categories.map(category =>
      <div className="col-lg-4">
        <div className="card mb-5 mb-lg-0">
          <div className="card-body">
            <h5 className="card-title text-muted text-uppercase text-center">{category.name}</h5>
            <h6 className="card-price text-center">${category.price}</h6>
            <hr>
            <a href="#" className="btn btn-block btn-primary text-uppercase">Buy</a>
          </div>
        </div>
      </div>);

  render() {
    const { event, eventOrganizer, relatedEvents, ticketCategories = [] } = this.state;
    const { name, coverImageUrl, metadata, startDate, endDate, webUrl } = event || {};    
    const { phone, email, webUrl: organizerWebUrl, name: organizerName } = eventOrganizer || {};    
    return (<Container>
              <div className="row">
                <Header/>
              </div>
              {event && eventOrganizer &&
                <div>
                <h1 className="my-4">{name}
                  <small>- {organizerName}</small>
                </h1>
                <div className="row">
                  <div className="col-md-8">
                    <img className="img-fluid" src={coverImageUrl} alt=""/>
                  </div>
                  <div className="col-md-4">
                    <h3 className="my-3">Description</h3>
                    <p>{metadata.description || 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nam viverra euismod odio, gravida pellentesque urna varius vitae. Sed dui lorem, adipiscing in adipiscing et, interdum nec metus. Mauris ultricies, justo eu convallis placerat, felis enim.'}</p>
                    <h3 className="my-3">Details</h3>
                    <ul>
                      <li>Start Date: {moment(startDate).format('llll')}</li>
                      <li>End Date: {moment(endDate).format('llll')}</li>
                      {webUrl && <li>Website: {webUrl}</li>}
                      <li>Organizer Phone: {phone}</li>
                      <li>Organizer Email: {email}</li>
                      <li>Organizer Website: {organizerWebUrl}</li>
                    </ul>
                     <div className="row">{this.renderTicketCategories(ticketCategories)}</div>
                    <button onClick={() => this.onBuyClicked()}>Buy</button>
                  </div>
                  </div>
                </div>
              }
              {this.renderRelatedEvents(relatedEvents)}
             </Container>);
  }

}