import { observable, action } from 'mobx';
import { makeGet, makePost } from '../modules/api-client';
import config from '../config';

class Event {
  @observable events = [];
  @observable word = null;
  @observable categoryId = null;
  @observable organizerId = null;
  @observable limit = null;
  @observable selectedEvent = {};
  useSystemToken = true;
  redirectOnFail = true;

  @action async searchEvents (word, { limit, categoryId, organizerId }) {
  	this.word = word;
    this.categoryId = categoryId;
    this.organizerId = organizerId;
    this.limit = limit;

  	let queryParams = limit ? `?limit=${limit}` : '';
  	queryParams += categoryId ? `&categoryId=${categoryId}` : '';
  	queryParams += organizerId ? `&organizerId=${organizerId}` : '';
    const url = `${config.eventServiceDomain}/api/events/byName/${word || 'undefined'}${queryParams}`;
    
    const events = (await makeGet(url, this.redirectOnFail, this.useSystemToken)) || [];
    if(events.length) {
      this.events = events;
    }
  }

  @action async getAllEvents (limit) {
  	let queryParams = limit ? `?limit=${limit}` : '';
    const events = (await makeGet(`${config.eventServiceDomain}/api/events/${queryParams}`, false, this.useSystemToken)) || [];
    if(events.length) {
      this.events = events;
    }
  }

  @action async getEvent (eventId) {
    const event = (await makeGet(`${config.eventServiceDomain}/api/events/${eventId}`, this.redirectOnFail, this.useSystemToken)) || {};
    if(event.length) {
      this.selectedEvent = event;
    }
    return event;
  }

  @action async getEventById (eventId) {
    const event = (await makeGet(`${config.eventServiceDomain}/api/events/${eventId}`, this.redirectOnFail, this.useSystemToken)) || {};
    return event;
  }

  @action async getEventByIds (eventIds) {
    console.log('eventIds', eventIds);
    return (await makePost(`${config.eventServiceDomain}/api/events/byIds`, { eventIds: JSON.stringify(eventIds) })) || {};
  }
  
  @action async getEventsByOrganizer (organizerId, limit) {
    let queryParams = limit ? `?limit=${limit}` : '';
    return (await makeGet(`${config.eventServiceDomain}/api/events/byOrganizer/${organizerId}${queryParams}`, this.redirectOnFail, this.useSystemToken)) || [];
  }

  @action async getEventsByCategory (categoryId, limit) {
    let queryParams = limit ? `?limit=${limit}` : '';
    return (await makeGet(`${config.eventServiceDomain}/api/events/byCategory/${categoryId}${queryParams}`, this.redirectOnFail, this.useSystemToken)) || [];
  }


  @action setSelectedEvent(event){
    this.selectedEvent = event;
  };

};

export const event = new Event();

