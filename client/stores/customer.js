import { action } from 'mobx';
import { makePost } from '../modules/api-client';
import config from '../config';

class Customer {
  @action async registerCustomer (customer) {
    const result = (await makePost(`${config.customerServiceDomain}/api/customers`, customer)) || {};
  }
};


export const customer = new Customer();

