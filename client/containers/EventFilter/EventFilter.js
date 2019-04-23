import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Dropdown from '../../components/Dropdown/Dropdown';
import SearchBox from '../../components/SearchBox/SearchBox';
import './EventFilter.css';

@inject('eventCategory', 'eventOrganizer')
@observer
export default class EventFilter extends Component {

  async componentWillMount() {
  	await this.props.eventCategory.getEventCategories();
  	await this.props.eventOrganizer.getEventOrganizers();
  }

  render() {
  	const { onSearch, onCategorySelected, onOrganizerSelected, eventCategory, eventOrganizer } = this.props;
  	const { eventCategories = [] } = eventCategory;
  	const { eventOrganizers = [] } = eventOrganizer;

    return <div className="row"> 
        		 <div className="col-sm-2 dropdown-container"><Dropdown items={eventCategories} onOptionSelected={onCategorySelected} defaultItem={{name: 'Select Category' }}/></div>
    		     <div className="col-sm-2 dropdown-container"><Dropdown items={eventOrganizers} onOptionSelected={onOrganizerSelected} defaultItem={{name: 'Select Organizer' }}/></div>
    		     <div className="col-sm-8"><SearchBox onSearch={this.onSearch}></SearchBox></div>
  	       </div>;
  }

}