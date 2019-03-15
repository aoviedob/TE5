import CouponApi from './coupon';
import CategoryApi from './ticket-category';
import TicketApi from './ticket';

export const initApis = app => {
  new CouponApi(app);
  new CategoryApi(app);
  new TicketApi(app);
};