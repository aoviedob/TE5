import { action } from 'mobx';
import { makeGet, makePost } from '../modules/api-client';
import config from '../config';

class Ticket {

  @action async getTicketsByCategoryId (categoryId) {
    return (await makeGet(`${config.ticketServiceDomain}/api/tickets/byCategory/${categoryId}`)) || [];
  }

  @action async reserveTicket(ticket) {
    const result = (await makePost(`${config.ticketServiceDomain}/api/tickets/reserve`, ticket)) || {};
  }

};

export const ticket = new Ticket();

