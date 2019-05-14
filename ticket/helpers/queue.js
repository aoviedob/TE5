import { connectToQueue } from '../workers/queue';
import { queue } from '../config';

export const sendQueueMessage = async params => {
  const { channel } = await connectToQueue();
  const { exchange, name } = queue;
  channel.assertExchange(exchange, 'topic', { durable: true });
  await channel.publish(exchange, params.type , new Buffer(JSON.stringify(params.msg)), { persistent: true });
};