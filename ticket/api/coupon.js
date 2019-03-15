import * as couponService from '../services/coupon-service';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { RequiredRole, authenticate } from '../decorators/authorization-handler';
import { PredefinedRole } from '../helpers/enums/dal-types';

const { POSTGRES_CONTEXT } = UnitOfWorkContext;

export default class CouponApi {

  constructor(app) {
    app.get('/api/coupons', authenticate, this.getCoupons);
    app.get('/api/coupons/:couponId', authenticate, this.getCouponById);
    app.get('/api/coupons/byCode/:code', authenticate, this.getCouponByCode);
    app.get('/api/coupons/likeCode/:code', authenticate, this.getCouponsByCode);
    app.get('/api/coupons/byCustomer/:customerId', authenticate, this.getCouponsByCustomerId);
    app.get('/api/coupons/byOrganizer/:organizerId', authenticate, this.getCouponsByOrganizerId);
    app.post('/api/coupons', authenticate, this.createCoupon);
    app.put('/api/coupons/:couponId', authenticate, this.updateCoupon);
    app.delete('/api/coupons/:couponId', authenticate, this.deleteCoupon);
  }

  @RequiredRole([PredefinedRole.ADMIN])
  async getCoupons(req) { return await couponService.getCoupons(POSTGRES_CONTEXT); }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER, PredefinedRole.AGENT])
  async getCouponById(req) {
    const { couponId } = req.params || {};
    return await couponService.getCouponById(POSTGRES_CONTEXT, couponId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER, PredefinedRole.AGENT])
  async getCouponByCode(req) {
    const { code } = req.params || {};
    return await couponService.getCouponByCode(POSTGRES_CONTEXT, code);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER, PredefinedRole.AGENT])
  async getCouponsByCode(req) {
    const { code } = req.params || {};
    return await couponService.getCouponsByCode(POSTGRES_CONTEXT, code);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER, PredefinedRole.AGENT])
  async getCouponsByCustomerId(req) {
    const { customerId } = req.params || {};
    return await couponService.getCouponsByCustomerId(POSTGRES_CONTEXT, customerId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER, PredefinedRole.AGENT])
  async getCouponsByOrganizerId(req) {
    const { organizerId } = req.params || {};
    return await couponService.getCouponsByOrganizerId(POSTGRES_CONTEXT, organizerId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER])
  async createCoupon(req) {
    const { body, tokenBody: { user: { id: userId }} } = req;
    return await couponService.createCoupon(POSTGRES_CONTEXT, body, userId);
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER])
  async updateCoupon(req) {
    const { body, params = {}, tokenBody: { user: { id: userId }} } = req;
    return await couponService.updateCoupon(POSTGRES_CONTEXT, { couponId: params.couponId, coupon: body, userId });
  }

  @RequiredRole([PredefinedRole.ADMIN, PredefinedRole.EVENT_MANAGER])
  async deleteCoupon(req) {
    const { couponId } = req.params || {};
    return await couponService.deleteCoupon(POSTGRES_CONTEXT, couponId);
  }
}
