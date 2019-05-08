import { observable, computed, action, toJS } from 'mobx';
import { makePost } from '../modules/api-client';
import config from '../config';

class Auth {
  @observable token;
  @observable email;
  @observable redirectionUrl;

  constructor() {
    this.token = sessionStorage.getItem('token') || null;
    this.email = sessionStorage.getItem('email') || null;
  };

  @computed get isAuthenticated () {
    return !!this.token;
  }

  @action setRedirectionUrl(url) {
    this.redirectionUrl = url;
  }

  @action hydrate (token, email) {
    this.token = token;
    sessionStorage.setItem('token', token);
    if (email) {
      this.email = email;
      sessionStorage.setItem('email', email);
    }
  }

  @action hydrateSystem (token) {
    this.systemToken = token;
  }

  @action async systemLogin () {
    const { token } = (await makePost(`${config.authServiceDomain}/api/login`, config.authSystemLoginCredentials)) || {};
    if (token){
      this.hydrateSystem(token);
    }
  }

  @action async login (credentials) {
    const { token, email } = (await makePost(`${config.authServiceDomain}/api/login`, credentials)) || {};
    if (token){
      this.hydrate(token, email);
      return true;
    }
    return false;
  }
};


export const auth = new Auth();

