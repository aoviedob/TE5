import amqp from 'amqplib/callback_api';
import { connectToQueue } from './queue';
import { queue } from '../config';
import { handleQueueMapping } from './handlers';
import bunyan from 'bunyan';
const logger = bunyan.createLogger({ name: 'TicketQueue'});

export const receiveMessages = async () => {
  const { conn, channel } = await connectToQueue();
  const { exchange, name } = queue;
  channel.assertExchange(exchange, 'topic', {durable: true});
  
  try {
    await channel.assertQueue(name, {exclusive: true}) ;
    
    channel.prefetch(1);
    
    await channel.bindQueue(name, exchange, name);

    logger.info({ name }, ' [*] Waiting for messages in %s. To exit press CTRL+C');

    channel.consume(name, async msg => { 
      logger.info({ name, msg }, 'New message received');

      const message = JSON.parse(msg.content.toString());
      await handleQueueMapping[message.type](message.msg);

    }, { noAck: true });

  } catch(error){
    logger.error({ error }, 'Queue Consumer Error');
  }

};