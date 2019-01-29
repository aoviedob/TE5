import newUuid from 'uuid/v4';
import { UnitOfWorkContext } from '../../helpers/enums/unit_of_work';
import DalTypes from '../helpers/enums/dal-types';
const { POSTGRES_TEST_CONTEXT } = UnitOfWorkContext;

jest.unmock('../order-service');

const externalService = require('../external-service');

const products = [
  { id: newUuid(), name: 'product', price: 5000 },
  { id: newUuid(), name: 'product2', price: 3500 },
];

const orderLines = [
 { externalProductName: products[0].name,
   externalProductId: products[0].id,
   quantity: 2, 
 }, { 
  externalProductName: products[1].name,
  externalProductId: products[1].id,
  quantity: 1, 
}];

const customerId = newUuid();

externalService.getProduct = jest.fn(() => ({ id, name, price });

const { createOrder, createOrderLine, getOrdersByCustomerId, getOrderById, updateOrderLine, updateOrder, deleteOrderLine, deleteOrder } = require('../order-service');

describe('Order Service', () => {
  describe('When "createOrder" function gets called', () => {
  	describe('And valid params are passed', () => {
      test('It should save the order successfully', async() => {
        const result = await createOrder(POSTGRES_TEST_CONTEXT, { customerId, orderLines });
      	expect(result.id).not.toBe(undefined);
	    });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await createOrder(POSTGRES_TEST_CONTEXT, {}); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	    });
  	});
  });

  describe('When "getOrderById" function gets called', () => {
    let orderId;
    beforeEach(async() => {
      const order = await createOrder(POSTGRES_TEST_CONTEXT, { customerId, orderLines });
      orderId = order.id;
    });

    describe('And valid params are passed', () => {
      test('It should return the order by id with the order lines and the correct total amount', async() => {
        const { id, orderLines: dbOrderLines, totalAmount } = await getOrderById(POSTGRES_TEST_CONTEXT, { orderId });
        expect(id).toBe(orderId);
        
        const mapProductIds = orderLines => dbOrderLines.map(ol => ol.externalProductId);
        expect(mapProductIds(dbOrderLines)).toEqual(mapProductIds(orderLines));

        expect(totalAmount).toBe((products[0].price * orderLines[0].quantity) + (products[1].price * orderLines[1].quantity));
      });
    });
    describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getOrderById(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
      });
    });
  });

  describe('When "getOrdersByCustomerId" function gets called', () => {
    let orders = [];
    beforeEach(async() => {
      orders.push(await createOrder(POSTGRES_TEST_CONTEXT, { customerId, orderLines }));
      orders.push(await createOrder(POSTGRES_TEST_CONTEXT, { customerId, orderLines }));
    });

    describe('And valid params are passed', () => {
      test('It should return the orders by customer id', async() => {
        const dbOrders = await getOrdersByCustomerId(POSTGRES_TEST_CONTEXT, customerId);
        expect(dbOrders).toEqual(orders);
      });
    });

    describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getOrdersByCustomerId(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
      });
    });
  });

  describe('When "createOrderLine" function gets called', () => {
    let orderId;
  	beforeEach(async() => {
      const order = await createOrder(POSTGRES_TEST_CONTEXT, { customerId });
      orderId = order.id;
  	});

  	describe('And valid params are passed', () => {
      test('It should save the order line successfully and the total amount has to be updated', async() => {
        const orderLine = orderLines[0];
        const result = await createOrderLine({}, POSTGRES_TEST_CONTEXT, orderLine );
        expect(result.id).not.toBe(undefined);

        const { orderLines: dbOrderLines, totalAmount } = await getOrderById(POSTGRES_TEST_CONTEXT, { orderId });
        expect(dbOrderLines[0].externalProductId).toBe(orderLine.externalProductId);
        expect(totalAmount).toBe(products[0].price * orderLine.quantity);
      });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await createOrderLine({}, POSTGRES_TEST_CONTEXT);
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	    });
  	});
  });

  describe('When "updateOrder" function gets called', () => {
  	
  	let orderId;
    beforeEach(async() => {
      const order = await createOrder(POSTGRES_TEST_CONTEXT, { customerId });
      orderId = order.id;
    });

    describe('And valid params are passed', () => {
      test('It should update the order and its total amount successfully', async() => {
        const newStatus = DalTypes.OrderStatus.PROCESSED;
        await updateOrder(POSTGRES_TEST_CONTEXT, orderId, { status: newStatus, orderLines });
        const { status, orderLines: dbOrderLines, totalAmount } = await getOrderById(POSTGRES_TEST_CONTEXT, { orderId });

        expect(status).toBe(newStatus);
        expect(dbOrderLines).toEqual(orderLines);
        expect(totalAmount).toBe((products[0].price * orderLines[0].quantity) + (products[1].price * orderLines[1].quantity));
  	  });
    });
    describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await updateOrder(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
  	  });
  	});

  });

  describe('When "updateOrderLine" function gets called', () => {
    
    let orderId;
    const oneOrderLineList = [orderLines[0]];
    beforeEach(async() => {
      const order = await createOrder(POSTGRES_TEST_CONTEXT, { customerId, orderLines: oneOrderLineList });
      orderId = order.id;
    });

    describe('And valid params are passed', () => {
      test('It should update the order line and the order total amount successfully', async() => {
        const quantity = 5;
        await updateOrderLine({}, { dbContext: POSTGRES_TEST_CONTEXT, orderLine: { orderId,  externalProductId: orderLines[0].externalProductId, quantity });
        const { status, orderLines: dbOrderLines, totalAmount } = await getOrderById(POSTGRES_TEST_CONTEXT, { orderId });

        expect(status).toBe(newStatus);
        expect(dbOrderLines).toEqual(oneOrderLineList);
        expect(totalAmount).toBe(products[0].price * quantity);
      });
    });
    describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await updateOrderLine({}, POSTGRES_TEST_CONTEXT);
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
      });
    });

  });

  describe('When "deleteCustomer" function gets called', () => {
    
    let customerId;
    beforeEach(async() => {
      const result = await createCustomer(POSTGRES_TEST_CONTEXT, { email: 'test@gmail.com', fullname: customers[0], password: '12345678' });
      customerId = result.id;
    });

    describe('And valid params are passed', () => {
      test('It should delete the customer successfully', async() => {
        await deleteCustomer(POSTGRES_TEST_CONTEXT, customerId);
        const result = await getCustomerById(POSTGRES_TEST_CONTEXT, customerId);

        expect(result).toEqual({});
      });
    });
    describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await deleteCustomer(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
      });
    });
  });

});
