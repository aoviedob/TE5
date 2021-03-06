import Express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bunyan from 'bunyan';
import expressLogger from 'express-bunyan-logger';
import path from 'path';
import fs from 'fs';

const logger = bunyan.createLogger({ name: 'ClientServer'});

const logsDir = './logs';
const logsFilePath = `${logsDir}/client.log`;

if(!fs.existsSync(logsFilePath)) {
 !fs.existsSync(logsDir) && fs.mkdirSync(logsDir);
  fs.writeFileSync(logsFilePath, '');
}

const app = new Express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressLogger({
  name: 'ClientServer',
  streams: [{
    type: 'rotating-file',
    level: 'info',
    path: logsFilePath,
    period: '1d',
    count: 3,
  }]
}));

app.listen(80, () => {
  logger.info('Client Server started successfully on port 80');
});

const isDeveloping = process.env.NODE_ENV !== 'production';

if (isDeveloping) {
  let webpack = require('webpack');
  let webpackMiddleware = require('webpack-dev-middleware');
  let webpackHotMiddleware = require('webpack-hot-middleware');
  let config = require('./webpack.config.js');
  
  const compiler = webpack(config);
  const wpMiddleware = webpackMiddleware(compiler, {
    publicPath: config.output.publicPath,
    noInfo: true,
    quiet: false,
    lazy: false,
    watchOptions: {
      aggregateTimeout: 300,
      poll: true
    },
    stats: {
      colors: true,
    }
  });
  const history = require('connect-history-api-fallback');
  app.use(history());
  app.use(wpMiddleware);
  app.use(webpackHotMiddleware(compiler));
  
} else {
  app.use(express.static(`${__dirname}/dist/bundle.js`));
}
