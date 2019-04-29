import { observable, action, toJS } from 'mobx';
import { makeGet } from '../modules/api-client';
import config from '../config';

class EventOrganizer {
  @observable organizers = [];

  get eventOrganizers() {
    return toJS(this.organizers);
  }
  @action async getEventOrganizers () { 

    const eventOrganizers = (await makeGet(`${config.eventServiceDomain}/api/organizers`)) || [];
    if(eventOrganizers.length) {
      this.organizers = eventOrganizers;
    }
  }

  @action async getOrganizer (organizerId) {
    const organizer = (await makeGet(`${config.eventServiceDomain}/api/organizers/${organizerId}`)) || {};
    return organizer;
  }

  @action async getEventOrganizersByUserId () { 
    const organizers = (await makeGet(`${config.eventServiceDomain}/api/organizers/byUser/userId`)) || [];
    console.log('aa', { organizers });
    this.organizers = organizers;
    return organizers;
  }
};

export const eventOrganizer = new EventOrganizer();

