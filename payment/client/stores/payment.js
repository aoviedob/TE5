import { observable, action } from 'mobx';
import { makePost } from '../modules/api-client';

class Payment {
  @observable paymentData;
  @observable cardInfo;
  @observable result;
  @observable cardType;

  constructor() {
    this.paymentData = {
      cardNumber: '',
      cardHolder: '',
      securityCode: '',
      expirationDate: ''
    };
  };

  @action async pay () { 
    this.result = await makePost('/api/payment', this.paymentData);
  }

  @action async checkCardType () { 
    const cardTypeResult = await makePost('/api/payment/card', this.cardInfo);
    if (cardTypeResult.invalid) {
      this.result = 'The Credit Card does not exist';
      return this.result;
    }
    this.cardType = cardTypeResult.type;
  }

};

export const payment = new Payment();

