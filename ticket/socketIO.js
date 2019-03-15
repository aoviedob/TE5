import SocketIO from 'socket.io';
import  { createServer } from 'http';
import bunyan from 'bunyan';
const logger = bunyan.createLogger({ name: 'SocketIO'});

let io; 

export const createSocketServer = app => { 
  const server = createServer(app);
  io = new SocketIO(server);
  server.listen(8099); 
  logger.info('SocketIO server created on port 8099');
};

export const connectIo = async () => await io.on('connection', socket => socket);

export const notify = async params => {
  const conn = await connectIo();
  conn.emit(params.type, params.msg);
  logger.info(params, 'Notification sent');
}
