/**
 * THIS IS THE ENTRY POINT FOR THE CLIENT, JUST LIKE server.js IS THE ENTRY POINT FOR THE SERVER.
 */
import '@babel/polyfill';
import React from 'react';
import { render } from 'react-dom';
import 'helpers/checks/flexbox';
import 'helpers/checks/use-gemini-fix';
import 'helpers/position';
import 'helpers/window-resize';
import 'helpers/focus-fix';

import cfg from 'helpers/cfg';
import { Provider } from 'mobx-react';

import { browserHistory as history } from 'react-router';

import { apiClient } from './modules/api-client';
import { initErrorModule } from '../../client/modules/errorModule';
// will add a class flex to the DOM if flex is supported
import { initAuth } from './modules/init-auth';
import * as stores from './stores';
import * as models from './models';

import Root from './containers/root/root';
import './sass/global.scss';
import { location } from '../../client/helpers/navigator';
import { initTrans } from '../../common/helpers/i18n-client';
import { init as initCloudinaryHelpers } from '../../common/helpers/cloudinary';
import { initVersionHelper } from '../../client/helpers/version-helper';
import { initSocketListener } from './modules/socket-listener';
import { init as initFullStoryModule } from './modules/full-story-module';
import { overrideClick } from '../../client/modules/click-override.ts';
import { initClientLogger } from '../../common/client/logger';
import { registerWalkMeGlobals } from './modules/walk-me-globals';

overrideClick();

const logger = initClientLogger({
  apiClient,
  getContextData() {
    const { application = {} } = stores;
    return application.applicationObject;
  },
});

const i18nOptions = cfg('i18nOptions');

const wsUrl = cfg('socketConfig.url');

initErrorModule(logger, { id: 'rentapp' });

// this module will be in charge to handle the token changes
initAuth({
  auth: stores.auth,
  location,
  wsUrl,
  application: stores.application,
  agent: stores.agent,
});

if (process.env.NODE_ENV === 'development') {
  window.__stores = stores;
}

initSocketListener({ auth: stores.auth, application: stores.application, agent: stores.agent });

initCloudinaryHelpers({ cloudName: cfg('cloudinaryCloudName', 'revat') });

initVersionHelper(apiClient);

initTrans(i18nOptions, () => {
  // the pseudo random key is needed because this callback is executed
  // also when the translations are reloaded. if we don't use a key
  // react will refuse to re render the app
  render(
    <Provider {...stores} {...models}>
      <Root key={`key-${Date.now()}`} history={history} />
    </Provider>,
    document.querySelector('#content'),
  );
});

initFullStoryModule(stores.auth);
registerWalkMeGlobals(stores.application, cfg('urls.walkMeScriptURL'), cfg('agentInfo'));

// TODO: why is this line used?
stores.application.setApplicationSettings(stores.applicationSettings);
