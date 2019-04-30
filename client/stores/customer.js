import { action } from 'mobx';
import { makePost } from '../modules/api-client';
import config from '../config';

class Customer {
  useSystemToken = true;

  @action async registerCustomer (customer) {
    const result = (await makePost(`${config.customerServiceDomain}/api/customers`, customer, this.useSystemToken)) || {};
    return result;
  }
};


export const customer = new Customer();

