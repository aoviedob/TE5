import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import Dropdown from '../../components/Dropdown/Dropdown';

@inject('event')
@observer
export default class EventFilter extends Component {

  render() {
    const { events } = this.props.event;
  	return <div className="row"> 
             <div className="col-sm-6"><Dropdown/></div>
    		     <div className="col-sm-6"><Dropdown/></div>
  	       </div>;
  }

}