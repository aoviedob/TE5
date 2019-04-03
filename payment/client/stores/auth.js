import { observable, computed, action, toJS } from 'mobx';

class Auth {
  @observable token;

  constructor() {
    this.token = null;
  };

  @computed get isAuthenticated () {
    return !!this.token;
  }

  @action async hydrate (token) {
    this.token = token;
  }
};


export const auth = new Auth();

