import '@babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import * as stores from './stores';
import Root from './containers/Root';

const getTokenInUrl = pathname => {
  const matches = pathname.match(/\?token=(.*)/);

  if (!matches) return null;
  return matches[1];
};

const token = getTokenInUrl(window.location.search);
stores.auth.hydrate(token);

render(
  <Provider {...stores}>
    <Root key={`key-${Date.now()}`} />
    </Provider>,
  document.querySelector('#root'),
);
