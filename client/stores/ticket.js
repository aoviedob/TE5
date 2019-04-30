import { action } from 'mobx';
import { makeGet } from '../modules/api-client';
import config from '../config';

class Ticket {

  @action async getTicketsByCategoryId (categoryId) {
    return (await makeGet(`${config.ticketServiceDomain}/api/tickets/byCategory/${categoryId}`)) || [];
  }

};

export const ticket = new Ticket();

