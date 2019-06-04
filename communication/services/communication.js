import { connectToQueue } from '../workers/queue';
import { queue } from '../config';

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
  [Templates.CONFIRM_REGISTRATION]: data => (),
  [Templates.FORGOT_PASSWORD]: data => (),
  [Templates.INVOICE_CONFIRMATION]: data => (),
};

export const sendEmail = (email, template, data) => {
  const templateBuilder = templateMapping[template];
  if(!templateHandler) { 
  	throw new Error();
  }

  const template = templateBuilder(data);

  

};