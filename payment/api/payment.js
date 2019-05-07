import * as paymentService from '../services/payment-service';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';

const { POSTGRES_CONTEXT } = UnitOfWorkContext;

export default class PaymentApi {

  constructor(app) {
    app.post('/api/payment', this.pay);
    app.get('/api/payment/amount', this.getPaymentAmount);
    app.post('/api/payment/key', this.requestApiKey);
    app.post('/api/payment/initiate', this.initiatePayment);
    app.post('api/payment/login', this.login);
  }
  
  async pay(req) {
    const { body } = req;
    return await paymentService.pay(req, POSTGRES_CONTEXT, body);
  }

  async getPaymentAmount(req) { return await paymentService.getPaymentAmount(req); }

  async requestApiKey(req) {
    const { clientId } = req.params || {};
    const { body } = req;
    return await paymentService.requestApiKey(req, clientId, body);
  }

  async initiatePayment(req) {
    const { clientId } = req.params || {};
    const { body } = req;
    return await paymentService.initiatePayment(req, clientId, body);
  }

  async login(req) { return await paymentService.login(req); }
}
