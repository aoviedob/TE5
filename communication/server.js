import Express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bunyan from 'bunyan';
import expressLogger from 'express-bunyan-logger';
import { initApis } from './api/communication';
import { routerMiddleware } from './api/api-middleware';
import fs from 'fs';
import { receiveMessages } from './workers/consumer';

const logger = bunyan.createLogger({ name: 'CommunicationServer'});

const logsDir = './logs';
const logsFilePath = `${logsDir}/communication.log`;

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
  name: 'CommunicationServer',
  streams: [{
    type: 'rotating-file',
    level: 'info',
    path: logsFilePath,
    period: '1d',
    count: 3,
  }]
}));

initApis(app);

app.listen(3065, () => {
  logger.info('Communication Server started successfully on port 3065');
});

receiveMessages();
