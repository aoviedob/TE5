import newUuid from 'uuid/v4';
import { UnitOfWorkContext } from '../../helpers/enums/unit_of_work';
import DalTypes from '../../helpers/enums/dal-types';
const { POSTGRES_TEST_CONTEXT } = UnitOfWorkContext;

jest.unmock('../order-service');
jest.unmock('../customer-service');

const products = [
  { id: newUuid(), name: 'product', price: 5000 },
  { id: newUuid(), name: 'product2', price: 3500 },
];

const externalService = require('../external-service');
externalService.getProduct = jest.fn((ctx, id) => products.find(product => product.id === id));
externalService.createUser = jest.fn(() => newUuid());

const { createOrder, createOrderLine, getOrdersByCustomerId, getOrderById, updateOrderLine, updateOrder, deleteOrderLine, deleteOrder } = require('../order-service');
const { createCustomer } = require('../customer-service');

const orderLines = [
 { externalProductName: products[0].name,
   externalProductId: products[0].id,
   quantity: 2, 
 }, { 
  externalProductName: products[1].name,
  externalProductId: products[1].id,
  quantity: 1, 
}];

let customerId;

const mapProductIds = orderLines => orderLines.map(ol => ol.externalProductId);

describe('Order Service', () => {
  
  beforeEach(async() => {
    const customer = await createCustomer(POSTGRES_TEST_CONTEXT, { email: 'test@gmail.com', fullname: 'test', password: '12345678' });
    customerId = customer.id;
  });

  describe('When "createOrder" function gets called', () => {
  	describe('And valid params are passed', () => {
      test('It should save the order successfully', async() => {
        const result = await createOrder({}, { dbContext: POSTGRES_TEST_CONTEXT, order: { customerId, orderLines }});
      	expect(result.id).not.toBe(undefined);
	    });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await createOrder({}, {}); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	    });
  	});
  });

  describe('When "getOrderById" function gets called', () => {
    let orderId;
    beforeEach(async() => {
      const order = await createOrder({}, { dbContext: POSTGRES_TEST_CONTEXT, order: { customerId, orderLines } });
      orderId = order.id;
    });

    describe('And valid params are passed', () => {
      test('It should return the order by id with the order lines and the correct total amount', async() => {
        const result = await getOrderById(POSTGRES_TEST_CONTEXT, { orderId });
        const { id, orderLines: dbOrderLines, totalAmount } = result;
        expect(id).toBe(orderId);
        
        mapProductIds(dbOrderLines).forEach(x => expect(mapProductIds(orderLines)).toContain(x));

        expect(parseFloat(totalAmount)).toBe((products[0].price * orderLines[0].quantity) + (products[1].price * orderLines[1].quantity));
      });
    });
    describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await getOrderById(POSTGRES_TEST_CONTEXT, {}); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
      });
    });
  });

  describe('When "getOrdersByCustomerId" function gets called', () => {
    let orders = [];
    beforeEach(async() => {
      orders.push(await createOrder({}, { dbContext: POSTGRES_TEST_CONTEXT, order: { customerId, orderLines } }));
      orders.push(await createOrder({}, { dbContext: POSTGRES_TEST_CONTEXT, order: { customerId, orderLines } }));
    });

    describe('And valid params are passed', () => {
      test('It should return the orders by customer id', async() => {
        const dbOrders = await getOrdersByCustomerId(POSTGRES_TEST_CONTEXT, customerId);
        dbOrders.forEach(x => expect(orders.map(order =>({ ...order, orderLines: []}))).toContainEqual({ ...x, orderLines: []}));
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
      const order = await createOrder({}, { dbContext: POSTGRES_TEST_CONTEXT, order: { customerId }});
      orderId = order.id;
  	});

  	describe('And valid params are passed', () => {
      test('It should save the order line successfully and the total amount has to be updated', async() => {
        const orderLine = { ...orderLines[0], orderId };
        const result = await createOrderLine({}, { dbContext: POSTGRES_TEST_CONTEXT, orderLine });
        expect(result.id).not.toBe(undefined);

        const { orderLines: dbOrderLines, totalAmount } = await getOrderById(POSTGRES_TEST_CONTEXT, { orderId });
        expect(dbOrderLines[0].externalProductId).toBe(orderLine.externalProductId);
        expect(parseFloat(totalAmount)).toBe(products[0].price * orderLine.quantity);
      });
  	});
  	describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await createOrderLine({}, { dbContext: POSTGRES_TEST_CONTEXT });
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
	    });
  	});
  });

  describe('When "updateOrder" function gets called', () => {
  	
  	let orderId;
    beforeEach(async() => {
      const order = await createOrder({}, { dbContext: POSTGRES_TEST_CONTEXT, order: { customerId } });
      orderId = order.id;
    });

    describe('And valid params are passed', () => {
      test('It should update the order and its total amount successfully', async() => {
        const newStatus = DalTypes.OrderStatus.PROCESSED;
        await updateOrder({}, { dbContext: POSTGRES_TEST_CONTEXT, orderId, order: { status: newStatus, orderLines }});
        const { status, orderLines: dbOrderLines, totalAmount } = await getOrderById(POSTGRES_TEST_CONTEXT, { orderId });

        expect(status).toBe(newStatus);
        mapProductIds(dbOrderLines).forEach(x => expect(mapProductIds(orderLines)).toContain(x));
        expect(parseFloat(totalAmount)).toBe((products[0].price * orderLines[0].quantity) + (products[1].price * orderLines[1].quantity));
  	  });
    });
    describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await updateOrder({}, {}); 
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
      const order = await createOrder({}, { dbContext: POSTGRES_TEST_CONTEXT, order: { customerId, orderLines: oneOrderLineList }});
      orderId = order.id;
    });

    describe('And valid params are passed', () => {
      test('It should update the order line and the order total amount successfully', async() => {
        const quantity = 5;
        await updateOrderLine({}, { dbContext: POSTGRES_TEST_CONTEXT, orderLine: { orderId,  externalProductId: orderLines[0].externalProductId, quantity }});
        const { status, orderLines: dbOrderLines, totalAmount } = await getOrderById(POSTGRES_TEST_CONTEXT, { orderId });
       
        mapProductIds(dbOrderLines).forEach(x => expect(mapProductIds(oneOrderLineList)).toContain(x));
        expect(parseFloat(totalAmount)).toBe(products[0].price * quantity);
      });
    });
    describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await updateOrderLine({}, { dbContext: POSTGRES_TEST_CONTEXT });
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
      });
    });

  });

  describe('When "deleteOrder" function gets called', () => {
    
    let orderId;
    beforeEach(async() => {
      const order = await createOrder({}, { dbContext: POSTGRES_TEST_CONTEXT, order: { customerId, orderLines } });
      orderId = order.id;
    });

    describe('And valid params are passed', () => {
      test('It should delete the order and all the its order lines successfully', async() => {
        await deleteOrder(POSTGRES_TEST_CONTEXT, orderId);
        const result = await getOrderById(POSTGRES_TEST_CONTEXT, { orderId });

        expect(result).toEqual({});
      });
    });
    describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await deleteOrder(POSTGRES_TEST_CONTEXT); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
      });
    });
  });

  describe('When "deleteOrderLine" function gets called', () => {
    
    let orderId;
    beforeEach(async() => {
      const order = await createOrder({}, { dbContext: POSTGRES_TEST_CONTEXT, order: { customerId, orderLines } });
      orderId = order.id;
    });

    describe('And valid params are passed', () => {
      test('It should delete order line successfully', async() => {
        await deleteOrderLine({}, { dbContext: POSTGRES_TEST_CONTEXT, orderId, externalProductId: orderLines[0].externalProductId });
        const result = await getOrderById(POSTGRES_TEST_CONTEXT, { orderId });

        expect(mapProductIds(result.orderLines)).toEqual(mapProductIds(orderLines.slice(1, orderLines.length)));
      });
    });
    describe('And not valid params are passed', () => {
      test('It should throw a SERVICE_PRECONDITION_FAILED error', async() => {
        try {
          await deleteOrderLine({}, {}); 
        } catch(error) {
          expect(error.message).toBe('SERVICE_PRECONDITION_FAILED');
        }
      });
    });
  });

});
