import { observable, action, toJS } from 'mobx';
import { makeGet } from '../modules/api-client';
import config from '../config';

class EventOrganizer {
  @observable organizers = [];
  redirectOnFail = true;
  useSystemToken = true;

  get eventOrganizers() {
    return toJS(this.organizers);
  }

  @action async getEventOrganizers () { 
    const eventOrganizers = (await makeGet(`${config.eventServiceDomain}/api/organizers`, this.redirectOnFail, this.useSystemToken)) || [];
    if(eventOrganizers.length) {
      this.organizers = eventOrganizers;
    }
  }

  @action async getOrganizer (organizerId) {
    const organizer = (await makeGet(`${config.eventServiceDomain}/api/organizers/${organizerId}`, this.redirectOnFail, this.useSystemToken)) || {};
    return organizer;
  }

  @action async getEventOrganizersByUserId () { 
    const organizers = (await makeGet(`${config.eventServiceDomain}/api/organizers/byUser/userId`, this.redirectOnFail, false)) || [];
    console.log('organizers', organizers);
    this.organizers = organizers;
    return organizers;
  }
};

export const eventOrganizer = new EventOrganizer();

