import { observable, action } from 'mobx';
import { makeGet, makePost } from '../modules/api-client';
import config from '../../config';

class Payment {
  @observable result = {};
  @observable amount = 0;

  @action async pay (paymentData) { 
    this.result = await makePost('http://localhost:4550/api/payment', paymentData);
    console.log('result', this.result);
  }

  @action async getAmount (token) { 
    const { amount } = (await makeGet('http://localhost:4550/api/payment/amount')) || {};
    this.amount = amount;
  }

};

export const payment = new Payment();

