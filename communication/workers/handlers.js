import MessageTypes from '../helpers/enums/queue-message-types';
import { sendEmailHandler } from '../services/communication';

export const handleQueueMapping = { 
  [MessageTypes.SEND_EMAIL]: sendEmailHandler,
};