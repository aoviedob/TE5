import { observable, computed, action, toJS } from 'mobx';
import { makePost } from '../modules/api-client';
import config from '../config';

class Auth {
  @observable token;
  @observable email;
  @observable userId;
  @observable redirectionUrl;
  @observable temporalToken;;

  constructor() {
    this.token = sessionStorage.getItem('token') || null;
    this.email = sessionStorage.getItem('email') || null;
    this.userId = sessionStorage.getItem('userId') || null;
    this.fullname = sessionStorage.getItem('fullname') || null;
  };

  @computed get isAuthenticated () {
    return !this.temporalToken && !!this.token;
  }

  @action setRedirectionUrl(url) {
    this.redirectionUrl = url;
  }

  @action hydrate (token, { email, fullname, userId } = {}, temporalToken) {
    this.temporalToken = temporalToken;
    this.token = token;
    if(!temporalToken) {
      sessionStorage.setItem('token', token);
    }
    if (email) {
      this.email = email;
      sessionStorage.setItem('email', email);
    }

    if (fullname) {
      this.fullname = fullname;
      sessionStorage.setItem('fullname', fullname);
    }

    if (userId) {
      this.userId = userId;
      sessionStorage.setItem('userId', userId);
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
    const { token, email, fullname, userId } = (await makePost(`${config.authServiceDomain}/api/login`, credentials)) || {};
    if (token){
      this.hydrate(token, { email, fullname, userId });
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

  @action async validateForgotPassword(body) {
   return (await makePost(`${config.authServiceDomain}/api/forgotPassword`, body, true)) || {};
  }

  @action async resetPassword(body){
    return (await makePost(`${config.authServiceDomain}/api/resetPassword`, body)) || {}; 
  }

};

export const auth = new Auth();

