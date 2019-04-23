import Express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import bunyan from 'bunyan';
import expressLogger from 'express-bunyan-logger';
import { initApis } from './api/api';
import { routerMiddleware } from './api/api-middleware';

const logger = bunyan.createLogger({ name: 'PaymentProvider'});

const app = new Express();
routerMiddleware(app);
app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressLogger({
  name: 'PaymentProvider',
  streams: [{
    type: 'rotating-file',
    level: 'info',
    path: './logs/payment.log',
    period: '1d',
    count: 3,
  }]
}));

initApis(app);

app.listen(4550, () => {
  logger.info('Payment Server started successfully on port 4550');
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
  app.use(wpMiddleware);
  app.use(webpackHotMiddleware(compiler));
  
} else {
  // serve the content using static directory
  app.use(express.static(`${__dirname}/dist/bundle.js`));
}
