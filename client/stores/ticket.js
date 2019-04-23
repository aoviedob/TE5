import { observable, action } from 'mobx';
import { makeGet, makePost } from '../modules/api-client';
import config from '../config';

class Ticket {
  @observable events = [];
  @observable word = null;
  @observable categoryId = null;
  @observable organizerId = null;
  @observable limit = null;
  @observable selectedEvent = {};


  @action async getEventsByOrganizer (organizerId, limit) {
    let queryParams = limit ? `?limit=${limit}` : '';
    return (await makeGet(`${config.eventServiceDomain}/api/events/byOrganizer/${organizerId}${queryParams}`)) || [];
  }

  @action async getEventsByCategory (categoryId, limit) {
    let queryParams = limit ? `?limit=${limit}` : '';
    return (await makeGet(`${config.eventServiceDomain}/api/events/byCategory/${categoryId}${queryParams}`)) || [];
  }


  @action setSelectedEvent(event){
    this.selectedEvent = event;
  };

};

export const ticket = new Ticket();

