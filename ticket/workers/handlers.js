import * as MessageTypes from './queue-message-types';

export const handleQueueMapping = { 
  [MessageTypes.ReserveTicket]: postEmergencies,
};