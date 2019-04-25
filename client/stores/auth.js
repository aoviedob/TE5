import { observable, computed, action, toJS } from 'mobx';
import { makePost } from '../modules/api-client';
import config from '../config';

class Auth {
  @observable token;

  constructor() {
    this.token = null;
  };

  @computed get isAuthenticated () {
    return !!this.token;
  }

  @action hydrate (token) {
    this.token = token;
  }

  @action async systemLogin () {
    const { token } = (await makePost(`${config.authServiceDomain}/api/login`, config.authSystemLoginCredentials)) || {};
    if (token){
      this.hydrate(token);
    }
  }

  @action async login (credentials) {
    const { token } = (await makePost(`${config.authServiceDomain}/api/login`, credentials)) || {};
    if (token){
      this.hydrate(token);
      return true;
    }
    return false;
  }
};


export const auth = new Auth();

