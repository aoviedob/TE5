import React, { Component } from 'react';
import Management from '../../components/Management/Management';
import { observer, inject } from 'mobx-react';
import { Container } from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Dropdown from '../../components/Dropdown/Dropdown';
import SearchBox from '../../components/SearchBox/SearchBox';
import './TicketCategoryManagement.css';

@inject('ticketCategory', 'eventOrganizer', 'event')
@observer
export default class TicketCategoryManagement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      organizers: [],
      selectedOrganizerId: null,
      showModal: false,
    };
  }

  headers = [ 
    'Name',
    'Event Name',
    'Quantity',
    'Available',
    'Price'
  ];

  setCategoryRows = async selectedOrganizerId => {
  	await this.props.ticketCategory.getCategoriesByOrganizer(selectedOrganizerId);
  	const events = await this.props.event.getEventsByOrganizer(selectedOrganizerId);
  	console.log('events', events);
  	this.props.ticketCategory.setEventDropdownItems(events);
    const categoryRows = this.props.ticketCategory.formatTicketCategories(events);

    this.setState({ categoryRows });
  };

  async componentWillMount() {
    const organizers = await this.props.eventOrganizer.getEventOrganizersByUserId();
    if (organizers.length === 1) {
      const selectedOrganizerId = organizers[0].id;
   	  this.setState({ selectedOrganizerId });
   	  await this.setCategoryRows(selectedOrganizerId);
    } 
  }

  onOrganizerSelected = async organizer => {
  	console.log('organizer', organizer);
  	const selectedOrganizerId = organizer.id;
  	this.setState({ selectedOrganizerId });
  	await this.setCategoryRows(selectedOrganizerId);
  };

  onSearch = word => {
    this.setState({ word }, async () => {});
  };

  onCategoryAdded = async model => {
  	//const { categoryModel } = this.props.ticketCategory;
  	//console.log('categoryModelhola', categoryModel);
  	// const category = {...model, externalEventId: categoryModel.externalEventId.value };
  	await this.props.ticketCategory.saveTicketCategory(model);
  };

  onAddClicked = () => this.setState({ showModal: true });
  onMoldalClosed = () => this.setState({ showModal: false });

  render() {
  	const { eventOrganizers } = this.props.eventOrganizer;
  	const { categoryModel, saveTicketCategory } = this.props.ticketCategory;
  	const { selectedOrganizerId, categoryRows=[], showModal } = this.state;
  	console.log(eventOrganizers.length);
  	console.log('categoryRows', categoryRows);
  	console.log('categoryModel', { categoryModel });
    return (<Container>
    		 <Header/>
             <div className="row">
               <div className="col-sm-4 organizer-selector">
                 {eventOrganizers.length && <Dropdown items={eventOrganizers} onOptionSelected={this.onOrganizerSelected} defaultItem={{name: 'Select Organizer' }} />}
               </div>
               <div className="col-sm-6">
                 <SearchBox onSearch={this.onSearch} placeholder="Search Ticket Categories"></SearchBox>
               </div>  
               <div className="col-sm-2">
                 {selectedOrganizerId && <button className="btn btn-primary" data-toggle="modal" data-target="#myModal" onClick={() => this.onAddClicked() }><i className="material-icons" style={{ color: 'white'}}>add</i></button>}
               </div>
             </div>
             <Management onAdd={() => this.onCategoryAdded} title="Create Ticket Category" model={categoryModel} rows={categoryRows} headers={this.headers} onAdd={saveTicketCategory} submitLabel="Save" showModal={showModal} onMoldalClosed={() => this.onMoldalClosed}/>
           </Container>);
  }

}