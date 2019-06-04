import amqp from 'amqplib/callback_api';
import { connectToQueue } from './queue';
import { queue } from '../config';
import { handleQueueMapping } from './handlers';
import bunyan from 'bunyan';
const logger = bunyan.createLogger({ name: 'CommunicationQueue'});

export const receiveMessages = async () => {
  const { conn, channel } = await connectToQueue();
  const { exchange, name } = queue;
  channel.assertExchange(exchange, 'topic', {durable: true});
  
  try {
    await channel.assertQueue(name);
    
    channel.prefetch(1);
    
    await channel.bindQueue(name, exchange, 'Communication');

    logger.info({ name }, ' [*] Waiting for messages in %s. To exit press CTRL+C');

    channel.consume(name, async msg => { 
      logger.info({ name, body: msg }, 'New message received');
      const type = msg.fields.routingKey;
      
      const message = JSON.parse(msg.content.toString());
      await handleQueueMapping[type](message);

    }, { noAck: true });

  } catch(error){
    logger.error({ error }, 'Queue Communication Error');
  }

};