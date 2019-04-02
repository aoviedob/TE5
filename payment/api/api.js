import PaymentApi from './payment';

export const initApis = app => {
  new PaymentApi(app);
};