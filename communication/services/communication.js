import { connectToQueue } from '../workers/queue';
import { queue } from '../config';
import { renderToString } from "react-dom/server"
import { Invoice } from '../templates/Invoice';
import { ConfirmRegistration } from '../templates/ConfirmRegistration';
import { ResetPassword } from '../templates/ResetPassword';
import { validatePreconditions } from '../helpers/validator';
import QueueMessageTypes from '../helpers/enums/queue-message-types';
import bunyan from 'bunyan';
const logger = bunyan.createLogger({ name: 'CommunicationService'});

export const sendQueueMessage = async params => {
  const { channel } = await connectToQueue();
  const { exchange, name } = queue;
  channel.assertExchange(exchange, 'topic', { durable: true });
  await channel.publish(exchange, params.type , new Buffer(JSON.stringify(params.msg)), { persistent: true });
};

const Templates = {
  CONFIRM_REGISTRATION: 'CONFIRM_REGISTRATION',
  FORGOT_PASSWORD: 'FORGOT_PASSWORD',
  INVOICE_CONFIRMATION: 'INVOICE_CONFIRMATION',
};

const templateMapping = {
  [Templates.CONFIRM_REGISTRATION]: data => renderToString(<ConfirmRegistration {...data } />),
  [Templates.FORGOT_PASSWORD]: data => renderToString(<ResetPassword {...data } />),
  [Templates.INVOICE_CONFIRMATION]: data => renderToString(<Invoice {...data } />),
};

export const sendEmailHandler = msg => {
  const { email, template, data } = msg;
  const templateBuilder = templateMapping[template];
  if(!templateHandler) {
  	logger.error(msg, 'TEMPLATE_DOES_NOT_EXIST');
  	throw new Error('TEMPLATE_DOES_NOT_EXIST');
  }

  const templateResult = templateBuilder(data);
  console.log('template', templateResult);

};

export const sendEmail = async body => {
  validatePreconditions(['email', 'template'], body);
  await sendQueueMessage({
    type: QueueMessageTypes.SEND_EMAIL,
    msg: body,
  });
};