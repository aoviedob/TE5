import * as couponRepo from '../dal/coupon-repo';
import { validatePreconditions } from '../helpers/validator';
import { mapRepoEntity, mapParams } from '../helpers/mapper';

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

export const updateCoupon = async (dbContext, couponId, coupon) => { 
  validatePreconditions(['dbContext', 'couponId', 'coupon'], { dbContext, couponId, coupon });
  return await couponRepo.updateCoupon(dbContext, couponId, mapParams(coupon));
};

export const createCoupon = async (dbContext, coupon) => {
  validatePreconditions(['dbContext', 'email', 'fullname', 'password'], { dbContext, ...coupon });
  const externalUserId = await createUser(coupon);
  const { id: couponId } = await couponRepo.createCoupon(dbContext, mapParams({ ...coupon, externalUserId }));
  return await getCouponById(dbContext, couponId);
};

export const deleteCoupon = async (dbContext, couponId) => {
  validatePreconditions(['dbContext', 'couponId'], { dbContext, couponId });
  await couponRepo.deleteCoupon(dbContext, couponId);
};
