import '@babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import * as stores from './stores';
import Root from './containers/Root';

import { getTokenFromRequest } from '../helpers/request';

const token = getTokenFromRequest(window.location.pathname);
stores.auth.hydrate(token);

render(
  <Provider {...stores}>
    <Root key={`key-${Date.now()}`} />
    </Provider>,
  document.querySelector('#root'),
);
