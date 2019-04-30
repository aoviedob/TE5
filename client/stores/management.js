import { action, observable } from 'mobx';

class Management {
  @observable shouldInitForm = false;

  @action async setShouldInitForm (value) {
  	this.shouldInitForm = value;
  }
};


export const management = new Management();

