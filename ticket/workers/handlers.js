import MessageTypes from '../helpers/enums/queue-message-types';
import { reserveTicketHandler, confirmTicketHandler } from '../services/ticket-service';

export const handleQueueMapping = { 
  [MessageTypes.RESERVE_TICKET]: reserveTicketHandler,
  [MessageTypes.CONFIRM_TICKET]: confirmTicketHandler,
};