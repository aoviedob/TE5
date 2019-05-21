import { action, observable, toJS } from 'mobx';
import { makeGet, makePost } from '../modules/api-client';
import config from '../config';

class Ticket {
  @observable tokens = [];

  get reservedTickets() {
    return toJS(this.tokens);
  }

  @action async getTicketsByCategoryId (categoryId) {
    return (await makeGet(`${config.ticketServiceDomain}/api/tickets/byCategory/${categoryId}`)) || [];
  }

  @action async reserveTicket(ticket) {
    const result = (await makePost(`${config.ticketServiceDomain}/api/tickets/reserve`, ticket)) || {};
  }

  @action hydrate(token) {
  	this.tokens.push(token);
  }

  @action async releaseTickets() {
  	await Promise.all(this.tokens.map(async token => {
  	  await makePost(`${config.ticketServiceDomain}/api/tickets/release`, { token });
  	}));

  	this.tokens = [];
  }

  @action async confirmTickets() {
    await Promise.all(this.tokens.map(async token => {
  	  await makePost(`${config.ticketServiceDomain}/api/tickets/confirm`, { token });
  	}));
  	
  	this.tokens = [];
  }
};

export const ticket = new Ticket();

