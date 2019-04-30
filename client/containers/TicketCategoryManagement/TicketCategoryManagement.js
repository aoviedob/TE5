import React, { Component } from 'react';
import Management from '../../components/Management/Management';
import { observer, inject } from 'mobx-react';
import { Container } from '../../components/Container/Container';
import Header from '../../components/Header/Header';
import Dropdown from '../../components/Dropdown/Dropdown';
import SearchBox from '../../components/SearchBox/SearchBox';
import './TicketCategoryManagement.css';

@inject('ticketCategory', 'eventOrganizer', 'event', 'ticket', 'management')
@observer
export default class TicketCategoryManagement extends Component {

  constructor(props) {
    super(props);
    this.state = {
      organizers: [],
      selectedOrganizerId: null,
      showModal: false,
      updateInProgress: false,
      canDelete: true,
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
  	const selectedOrganizerId = organizer.id;
  	this.setState({ selectedOrganizerId });
  	await this.setCategoryRows(selectedOrganizerId);
  };

  onSearch = word => {
    this.setState({ word }, async () => {});
  };

  onCategoryAdded = async model => {
  	await this.props.ticketCategory.saveTicketCategory({ ...model, externalOrganizerId: this.state.selectedOrganizerId});
 	await this.setCategoryRows(this.state.selectedOrganizerId);
  };

  onAddClicked = () => this.setState({ showModal: true });
  onMoldalClosed = () => this.setState({ showModal: false });

  onCategoryEditClicked = async category => {
    this.setState({ updateInProgress: true });
    const dbCategory = await this.props.ticketCategory.getCategory(category.id);
    this.props.ticketCategory.fillModel(dbCategory);

    this.props.management.setShouldInitForm(true);
  	this.btnAdd.click();
  };

  onCategoryEdited = async model => {
    console.log('model', model);
  	await this.props.ticketCategory.updateTicketCategory({ ...model, externalOrganizerId: this.state.selectedOrganizerId});
  	await this.setCategoryRows(this.state.selectedOrganizerId);
  };
  
  onCategoryDeleteClicked = async category => {
    const tickets = await this.props.ticket.getTicketByCategoryId(category.id);
    if (tickets.length > 0) {
      this.setState({ canDelete: false, deleteDescription: 'This ticket category can not be deleted because tickets were already buyed' });  
    } else {
      this.setState({ canDelete: true, deleteDescription: `Are you sure you want to delete '${category.name}'?` });  
    }
    
    this.btnDelete.click();
  };

  onCategoryDeleted = async category => {
    const { canDelete } = this.state;
    if (canDelete) {
      await this.props.ticketCategory.deleteTicketCategory(category);
      await this.setCategoryRows(this.state.selectedOrganizerId);
    } else {
      
    }
  };

  render() {
  	const { eventOrganizers } = this.props.eventOrganizer;
  	const { categoryModel, saveTicketCategory } = this.props.ticketCategory;
  	const { selectedOrganizerId, categoryRows=[], showModal, updateInProgress, deleteDescription } = this.state;

    return (<Container>
    		 <Header/>
             <div className="row">
               <div className="col-sm-4 organizer-selector">
                 {eventOrganizers.length > 0 && <Dropdown items={eventOrganizers} onOptionSelected={this.onOrganizerSelected} defaultItem={{name: 'Select Organizer' }} />}
               </div>
               <div className="col-sm-6">
                 {eventOrganizers.length > 0 && <SearchBox onSearch={this.onSearch} placeholder="Search Ticket Categories"></SearchBox>}
               </div>  
               <div className="col-sm-2">
                 {selectedOrganizerId && <button ref={node => { this.btnAdd = node;} } className="btn btn-primary" data-toggle="modal" data-target="#addEditModal" onClick={() => this.onAddClicked() }><i className="material-icons" style={{ color: 'white'}}>add</i></button>}
               </div>
             </div>
             <Management 
               onAdd={this.onCategoryAdded}
               onEdit={this.onCategoryEdited}
               isEdit={updateInProgress}
               title="Create Ticket Category" 
               model={categoryModel} 
               rows={categoryRows} 
               headers={this.headers} 
               submitLabel={updateInProgress ? 'Update' : 'Create' } 
               showModal={showModal} 
               onMoldalClosed={() => this.onMoldalClosed}
               onEditClicked={this.onCategoryEditClicked}
               onDeleteClicked={this.onCategoryDeleteClicked}
               deleteDescription={deleteDescription} />
               <input ref={node => { this.btnDelete = node;} } type="hidden" data-toggle="modal" data-target="#deleteModal"/>
           </Container>);
  }

}