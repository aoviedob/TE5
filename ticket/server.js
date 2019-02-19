import Express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bunyan from 'bunyan';
import expressLogger from 'express-bunyan-logger';
import { initApis } from './api/api';
import { routerMiddleware } from './api/api-middleware';

const logger = bunyan.createLogger({ name: 'TicketServer'});

const app = new Express();
routerMiddleware(app);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressLogger({
  name: 'TicketServer',
  streams: [{
    type: 'rotating-file',
    level: 'info',
    path: './logs/ticket.log',
    period: '1d',
    count: 3,
  }]
}));

initApis(app);

app.listen(3060, () => {
  logger.info('Ticket Server started successfully on port 3060');
});
