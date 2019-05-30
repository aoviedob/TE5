import { action } from 'mobx';
import { makePost, makeGet, makePut } from '../modules/api-client';
import config from '../config';

class Customer {
  useSystemToken = true;

  @action async registerCustomer (customer) {
    const result = (await makePost(`${config.customerServiceDomain}/api/customers`, customer, this.useSystemToken)) || {};
    return result;
  }

  @action async updateCustomer (customer) {
    const result = (await makePut(`${config.customerServiceDomain}/api/customers/${customer.id}`, customer)) || {};
    return result;
  }

  @action async getCustomerByEmail (email) {
    const result = (await makeGet(`${config.customerServiceDomain}/api/customers/byEmail/${email}`)) || {};
    return result;
  }

  @action async getCustomerById (customerId) {
    const result = (await makeGet(`${config.customerServiceDomain}/api/customers/${customerId}`)) || {};
    return result;
  }
};


export const customer = new Customer();

