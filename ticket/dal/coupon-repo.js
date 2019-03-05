import UnitOfWork from '../database/unit_of_work.js';
import { UnitOfWorkContext } from '../helpers/enums/unit_of_work';
import { schema } from '../config';

export const COUPON_TABLE = 'coupon';
const COUPON_TABLE_COLUMNS = [
  'id',
  'code',
  'name',
  'quantity',
  'available',
  'discount',
  'is_percentage',
  'state',
  'start_date',
  'end_date',
  'external_customer_id',
  'external_organizer_id',
  'external_event_id',
  'created_by',
  'updated_by',
  'created_at',
  'updated_at'
];

export const getCoupons = async dbContext => 
  await(new UnitOfWork(dbContext).getAll(schema, { 
    tableName: COUPON_TABLE, 
    columns: COUPON_TABLE_COLUMNS 
  }));

export const getCouponById = async (dbContext, couponId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
    tableName: COUPON_TABLE, 
    columns: COUPON_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('id = :couponId', { couponId })
  });
};

export const getCouponByCode = async (dbContext, code) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getOneWhere(schema, { 
    tableName: COUPON_TABLE, 
    columns: COUPON_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('code = :code', { code })
  });
};

export const getCouponsByCode = async (dbContext, code) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: COUPON_TABLE, 
    columns: COUPON_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('code LIKE :code', { code })
  });
};

export const getCouponsByCustomerId = async (dbContext, customerId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: COUPON_TABLE, 
    columns: COUPON_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('external_customer_id = :customerId', { customerId })
  });
};

export const getCouponsByOrganizerId = async (dbContext, organizerId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.getAllWhere(schema, { 
    tableName: COUPON_TABLE, 
    columns: COUPON_TABLE_COLUMNS,
    where: unitOfWork.dbConnection.raw('external_organizer_id = :organizerId', { organizerId })
  });
};

export const updateCoupon = async (dbContext, couponId, coupon) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.update(schema, { 
    tableName: COUPON_TABLE, 
    columns: COUPON_TABLE_COLUMNS,
    entity: coupon,
    where: unitOfWork.dbConnection.raw('id = :couponId', { couponId })
  });
};

export const deleteCoupon = async (dbContext, couponId) => { 
  const unitOfWork = new UnitOfWork(dbContext);
  return await unitOfWork.delete(schema, { 
    tableName: COUPON_TABLE, 
    where: unitOfWork.dbConnection.raw('id = :couponId', { couponId })
  });
};

export const createCoupon = async (dbContext, coupon) => {
  const result = await (new UnitOfWork(dbContext).create(schema, { 
    tableName: COUPON_TABLE, 
    columns: COUPON_TABLE_COLUMNS,
    entity: coupon,
  }));
  
  return (result.length && result[0]) || {};
};
