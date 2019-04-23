import Express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bunyan from 'bunyan';
import expressLogger from 'express-bunyan-logger';
import { initApis } from './api/api';
import { routerMiddleware } from './api/api-middleware';

const logger = bunyan.createLogger({ name: 'AuthServer'});

const app = new Express();
routerMiddleware(app);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressLogger({
  name: 'AuthServer',
  streams: [{
    type: 'rotating-file',
    level: 'info',
    path: './logs/auth.log',
    period: '1d',
    count: 3,
  }]
}));

initApis(app);

app.listen(3000, () => {
  logger.info('Auth Server started successfully on port 3000');
});
