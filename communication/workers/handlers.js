import MessageTypes from '../helpers/enums/queue-message-types';
import { sendEmail } from '../services/communication';

export const handleQueueMapping = { 
  [MessageTypes.SEND_EMAIL]: sendEmail,
};