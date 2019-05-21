import SocketTypes from './helpers/enums/socket-types';
import io from 'socket.io-client';
import config from './config';

const handleSocketMsgMapping = stores => ({
  ticket: { 
    [SocketTypes.TICKET_RESERVED]: async ({ token, ticketCategoryId, userId }) => {
      await stores.ticketCategory.getCategory(ticketCategoryId);
      stores.ticket.hydrate(token);
      console.log('hola');
    },
    [SocketTypes.RESERVE_TICKET_ERROR]: async ({ ticketCategoryId,  userId }) => {
      const { externalEventId, name } = await stores.ticketCategory.getCategory(ticketCategoryId);
      console.log('userId', userId);
      console.log('stores.auth.userId', stores.auth.userId);
      if (userId === stores.auth.userId) {
        const { name: eventName } = await stores.event.getEvent(externalEventId);
        stores.order.setError(`The ticket category ${name} is not available for event ${eventName}`);
        stores.order.setShowErrorDialog(true);
      }
    },
    [SocketTypes.TICKET_RELEASED]: ({ ticketCategoryId }) => stores.ticketCategory.getCategory(ticketCategoryId)
  },
  customer: {
    [SocketTypes.PAYMENT_RESULT]: ({ success }) => { console.log('aaa'); stores.order.setPaidState(success);},
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
