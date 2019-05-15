import SocketTypes from './helpers/enums/socket-types';
import io from 'socket.io-client';
import config from './config';

const handleSocketMsgMapping = stores => ({
  ticket: { 
    [SocketTypes.TICKET_RESERVED]: async ({ token, ticketCategoryId }) => { 
      await stores.ticketCategory.getCategory(ticketCategoryId);
      stores.ticket.hydrate(token);
    },
    [SocketTypes.TICKET_RELEASED]: ({ ticketCategoryId }) => stores.ticketCategory.getCategory(ticketCategoryId)
  },
  customer: {
    [SocketTypes.PAYMENT_RESULT]: ({ success }) => stores.order.setPaidState(success),
  }
});


export const connectToTicketSocket = () => {
  const socket = io.connect(config.ticketSocketIODomain, { 'forceNew': true });
  return socket;
};

export const connectToCustomerSocket = () => {
  const socket = io.connect(config.customerSocketIODomain, { 'forceNew': true });
  return socket;
};


export const startListening = async stores => {
  const eventsMap = handleSocketMsgMapping(stores);
  
  const ticketSocket = connectToTicketSocket();
  const ticketEventsMap = eventsMap.ticket;

  Object.keys(ticketEventsMap).map( async eventKey => {
    await ticketSocket.on(eventKey, async data => {
      await ticketEventsMap[eventKey](data);
    })
  });

  const customerEventsMap = eventsMap.customer;
  const customerSocket = connectToCustomerSocket();

  Object.keys(customerEventsMap).map( async eventKey => {
    await customerSocket.on(eventKey, async data => {
      await customerEventsMap[eventKey](data);
    })
  });
};
