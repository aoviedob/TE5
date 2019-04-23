import { observable, action } from 'mobx';
import { makeGet } from '../modules/api-client';
import config from '../config';

class EventOrganizer {
  @observable eventOrganizers = [];

  @action async getEventOrganizers () { 

    const eventOrganizers = (await makeGet(`${config.eventServiceDomain}/api/organizers`)) || [];
    if(eventOrganizers.length) {
      this.eventOrganizers = eventOrganizers;
    }
  }

  @action async getOrganizer (organizerId) {
    const organizer = (await makeGet(`${config.eventServiceDomain}/api/organizers/${organizerId}`)) || {};
    return organizer;
  }

};

export const eventOrganizer = new EventOrganizer();

