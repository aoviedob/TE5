import { action, observable, toJS } from 'mobx';
import { makeGet, makePost } from '../modules/api-client';
import config from '../config';

class Ticket {
  @observable tokens = [];
  @observable tickets = [];

  constructor() {
    this.tickets = JSON.parse(sessionStorage.getItem('tickets') || '[]');
  };

  get reservedTickets() {
    return toJS(this.tokens);
  }

  get invoices() {
    return toJS(this.tickets);
  }

  @action clearTickets() {
  	this.tickets = [];
  	sessionStorage.setItem('tickets', JSON.stringify(this.tickets));
  }

  @action addTicket(ticket) {
    this.tickets.push(ticket);
    sessionStorage.setItem('tickets', JSON.stringify(this.tickets));
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

  @action async getTicketsByCustomerId(customerId) {
    return (await makeGet(`${config.ticketServiceDomain}/api/tickets/byCustomer/${customerId}`)) || {};
  }
  
};

export const ticket = new Ticket();

