import CustomerApi from './customer';
import OrderApi from './order';

export const initApis = app => {
  new CustomerApi(app);
  new OrderApi(app);
};