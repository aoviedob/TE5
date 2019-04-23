import { observable, action } from 'mobx';
import { makeGet } from '../modules/api-client';
import config from '../config';

class TicketCategory {
  @observable eventOrganizers = [];

  @action async getCategoriesByEvent (eventId) {
    return (await makeGet(`${config.ticketServiceDomain}/api/categories/byEvent/${eventId}`)) || [];
  }

};

export const ticketCategory = new TicketCategory();

