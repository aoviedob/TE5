import amqp from 'amqplib';
import bunyan from 'bunyan';
import { queue } from '../config';

const logger = bunyan.createLogger({ name: 'TicketQueue'});

export const connectToQueue = async () => {
  let conn;
  let channel;

  try {
    conn = await amqp.connect(queue.hostname);
    channel = await conn.createChannel();
    
  }catch (error) {
    logger.error({ error }, 'Error connecting to the queue');
  }
     
  return {conn, channel};
};