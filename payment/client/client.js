import '@babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'mobx-react';
import * as stores from './stores';
import Root from './containers/Root';
import { getTokenFromRequest } from '../helpers/request';

const getTokenInUrl = pathname => {
  console.log('getTokenInUrl', pathname);
  const matches =
    pathname.match(/^\/welcome\/(.*)/) ||
    pathname.match(/^\/applicationList\/(.*)/) ||
    pathname.match(/review\/(.*)/) ||
    pathname.match(/^\/applicationAdditionalInfo\/(.*)/) ||
    pathname.match(/^\/resetPassword\/(.*)/) ||
    pathname.match(/^\/confirmResetPassword\/(.*)/);
  if (!matches) return null;
  console.log('found token', matches[1]);
  return matches[1];
};

const token = getTokenFromRequest(window.location.pathname);
console.log('window.location.pathname', window.location.pathname);
stores.auth.hydrate(token);

render(
  <Provider {...stores}>
    <Root key={`key-${Date.now()}`} />
    </Provider>,
  document.querySelector('#root'),
);
