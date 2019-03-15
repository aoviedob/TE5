import MessageTypes from './queue-message-types';
import { reserveTicketHandler, confirmTicketHandler } from '../services/ticket-service';

export const handleQueueMapping = { 
  [MessageTypes.ReserveTicket]: reserveTicketHandler,
  [MessageTypes.CONFIRM_TICKET]: confirmTicketHandler,
};