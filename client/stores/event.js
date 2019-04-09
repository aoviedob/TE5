import { observable, action } from 'mobx';
import { makeGet, makePost } from '../modules/api-client';
import config from '../config';

class Event {
  @observable events = [];

  @action async searchEvents (word) { 
    const events = (await makeGet(`${config.domain}/api/events/byName/${word}`)) || {};
    if(events && events.length) {
      this.events = events;
    }
  }

};

export const event = new Event();

