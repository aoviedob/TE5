import Express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bunyan from 'bunyan';
import expressLogger from 'express-bunyan-logger';
import { initApis } from './api/api';
import { routerMiddleware } from './api/api-middleware';
import fs from 'fs';

const logger = bunyan.createLogger({ name: 'EventServer'});

const logsDir = './logs';
const logsFilePath = `${logsDir}/event.log`;

if(!fs.existsSync(logsFilePath)) {
 !fs.existsSync(logsDir) && fs.mkdirSync(logsDir);
  fs.writeFileSync(logsFilePath, '');
}

const app = new Express();
routerMiddleware(app);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressLogger({
  name: 'EventServer',
  streams: [{
    type: 'rotating-file',
    level: 'info',
    path: logsFilePath,
    period: '1d',
    count: 3,
  }]
}));

initApis(app);

app.listen(3050, () => {
  logger.info('Event Server started successfully on port 3050');
});
