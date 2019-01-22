import CustomerApi from './customer';

export const initApis = app => {
  new CustomerApi(app);
};