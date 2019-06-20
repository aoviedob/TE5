import '@babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import * as stores from './stores';
import Root from './containers/Root';
import { startListening } from './socket-listener';

const getTokenInUrl = pathname => {
  const matches = pathname.match(/\?token=(.*)/);

  if (!matches) return null;
  return matches[1];
};

new Promise(async (resolve) => {
  const token = getTokenInUrl(window.location.search);
  if (!token) {
    await stores.auth.systemLogin(token);
  } else {
    stores.auth.hydrate(token, {}, true);
  }

  startListening(stores);
  resolve();
}).then(() =>
  render(
    <Provider {...stores}>
      <Root key={`key-${Date.now()}`} />
    </Provider>,
    document.querySelector('#root'),
  ));
