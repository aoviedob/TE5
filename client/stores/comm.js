import { action } from 'mobx';
import { makePost, makeGet, makePut } from '../modules/api-client';
import config from '../config';

class Comm {

  @action async sendEmail (data) {
    await makePost(`${config.commServiceDomain}/api/sendEmail`, data);
  }

};


export const comm = new Comm();

