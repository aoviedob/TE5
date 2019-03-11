import * as couponRepo from '../dal/coupon-repo';
import { validatePreconditions } from '../helpers/validator';
import { mapRepoEntity, mapParams } from '../helpers/mapper';
import { getTicketsByCouponId } from './ticket-service';
import bunyan from 'bunyan';
const logger = bunyan.createLogger({ name: 'CouponService'});

export const getCoupons = async dbContext => { 
  validatePreconditions(['dbContext'], { dbContext });
  return (await couponRepo.getCoupons(dbContext)).map(coupon => mapRepoEntity(coupon));
};

export const getCouponById = async (dbContext, couponId) => {
  validatePreconditions(['dbContext', 'couponId'], { dbContext, couponId });
  return mapRepoEntity((await couponRepo.getCouponById(dbContext, couponId)));
};

export const getCouponByCode = async (dbContext, code) => {
  validatePreconditions(['dbContext', 'code'], { dbContext, code });
  return mapRepoEntity((await couponRepo.getCouponByCode(dbContext, code)));
};

export const getCouponsByCode = async (dbContext, code) => {
  validatePreconditions(['dbContext', 'code'], { dbContext, code });
  return (await couponRepo.getCouponsByCode(dbContext, code)).map(coupon => mapRepoEntity(coupon));
};

export const getCouponsByCustomerId = async (dbContext, customerId) => {
  validatePreconditions(['dbContext', 'customerId'], { dbContext, customerId });
  return (await couponRepo.getCouponsByCustomerId(dbContext, customerId)).map(coupon => mapRepoEntity(coupon));
};

export const getCouponsByOrganizerId = async (dbContext, organizerId) => {
  validatePreconditions(['dbContext', 'organizerId'], { dbContext, organizerId });
  return mapRepoEntity(await couponRepo.getCouponsByOrganizerId(dbContext, organizerId));
};

const isCouponInUse = async (dbContext, couponId) => !!(await getTicketsByCouponId(dbContext, couponId).length);

const canUpdateCoupon = async (dbContext, couponId, coupon = {}) => {
  if(!(await isCouponInUse(dbContext, couponId))) return true;

  const { code, quantity, discount, isPercentage } = coupon;
  if (code || quantity || quantity === 0 || discount === 0 || discount || isPercentage !== null) return false;
};

export const updateCoupon = async (dbContext, { couponId, coupon, userId, trx }) => { 
  validatePreconditions(['dbContext', 'couponId', 'coupon', 'userId'], { dbContext, couponId, coupon, userId });
  
  if (!(await canUpdateCoupon(dbContext, couponId, coupon))) {
    const message = 'COUPON_IS_ALREADY_IN_USE';
    logger.error({ couponId, coupon }, message);
    const error = new Error(message);
    error.status = 412;
    throw error;
  }

  return await couponRepo.updateCoupon(dbContext, couponId, mapParams({ ...coupon, updatedBy: userId }), trx);
};

export const createCoupon = async (dbContext, coupon, userId) => {
  validatePreconditions(['dbContext', 'code', 'name', 'quantity', 'discount', 'isPercentage', 'externalOrganizerId', 'userId', 'state'], { dbContext, ...coupon, userId });

  const auditColumns = { updatedBy: userId, createdBy: userId };
  const { id: couponId } = await couponRepo.createCoupon(dbContext, mapParams({ ...coupon, ...auditColumns, available: coupon.quantity }));
  return await getCouponById(dbContext, couponId);
};

export const deleteCoupon = async (dbContext, couponId) => {
  if((await isCouponInUse(dbContext, couponId))) {
    const message = 'COUPON_IS_ALREADY_IN_USE';
    logger.error({ couponId }, message);
    const error = new Error(message);
    error.status = 412;
    throw error;
  }

  validatePreconditions(['dbContext', 'couponId'], { dbContext, couponId });
  await couponRepo.deleteCoupon(dbContext, couponId);
};
