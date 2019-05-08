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
    this.fullname = sessionStorage.getItem('fullname') || null;
  };

  @computed get isAuthenticated () {
    return !!this.token;
  }

  @action setRedirectionUrl(url) {
    this.redirectionUrl = url;
  }

  @action hydrate (token, { email, fullname }) {
    this.token = token;
    sessionStorage.setItem('token', token);
    if (email) {
      this.email = email;
      sessionStorage.setItem('email', email);
    }

    if (fullname) {
      this.fullname = fullname;
      sessionStorage.setItem('fullname', fullname);
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
    const { token, email, fullname } = (await makePost(`${config.authServiceDomain}/api/login`, credentials)) || {};
    if (token){
      this.hydrate(token, { email, fullname });
      return true;
    }
    return false;
  }

  @action async logOut () {
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('email');
    sessionStorage.removeItem('fullname');
    this.token = null;
    this.email = null;
    this.fullname = null;
    window.location.href = '/';
  }
};


export const auth = new Auth();

