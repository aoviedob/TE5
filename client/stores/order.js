import { observable, action, toJS } from 'mobx';
import { makeGet, makePost, makePut, makeDelete } from '../modules/api-client';
import config from '../config';
import DALTypes from '../helpers/enums/dal-types';

class Order {
  @observable order = {};
  @observable newOrderLine = null;
  @observable customerId;
  @observable alreadyPaid = false;
  @observable showErrorDialog = false;
  @observable error = '';

  get customerOrder() {
    return toJS(this.order);
  }

  get isPaid() {
    return this.alreadyPaid;
  }

  get shouldShowErrorDialog() {
    return this.showErrorDialog;
  }

  get errorMsg() {
    return this.error;
  }

  @action setCustomerId(customerId) {
    this.customerId = customerId;
  }

  @action setPaidState(value) {
    this.alreadyPaid = value;
    if (value) {
      this.order = {};
      this.newOrderLine = null;
    }
  }

  @action setShowErrorDialog(value) {
    this.showErrorDialog = value;
  }

  @action setError(error) {
    this.error = error;
  }

  @action setNewOrderLine(event, category) {
    this.newOrderLine = {
      externalProductName: event.name,
      externalProductId: event.id,
      externalProductCategoryId: category.id,
      quantity: 1
    };
  }

  @action async getPendingOrder() {
    let isThereAPendingOrder = true;
    let order = (await makeGet(`${config.customerServiceDomain}/api/orders/${this.customerId}/byStatus/${DALTypes.OrderStatus.PENDING}`));
    if (Object.keys(order).length === 0) {
      order = (await makePost(`${config.customerServiceDomain}/api/orders`, { customerId: this.customerId })) || {};
      isThereAPendingOrder = false;
    }

    this.order = order;
    await this.createOrderLine(order);
    return isThereAPendingOrder;
  }

  @action async updateOrderLine(orderLine) {
    const result = (await makePut(`${config.customerServiceDomain}/api/orders/lines/${this.order.id}/${orderLine.externalProductId}`, orderLine)) || {};
    const order = await makeGet(`${config.customerServiceDomain}/api/orders/${this.order.id}`) || {};
    this.order = order;
  }

  @action async createOrderLine(order) {
    if(!this.newOrderLine) return;

    (await makePost(`${config.customerServiceDomain}/api/orders/lines`, { ...this.newOrderLine, orderId: order.id })) || {};
    const result = await makeGet(`${config.customerServiceDomain}/api/orders/${order.id}`) || {};
    this.order = result;
  }

  @action async removeOrderLine(orderLine) {
    const result = (await makeDelete(`${config.customerServiceDomain}/api/orders/lines/${this.order.id}/${orderLine.externalProductId}`)) || {};
    const order = await makeGet(`${config.customerServiceDomain}/api/orders/${this.order.id}`) || {};
    this.order = order;
  }


  @action async initiatePayment() {
    const { order } = this;
    if(!order || order.orderLines.length < 1) return;

    const { formUrl } = (await makePost(`${config.customerServiceDomain}/api/orders/place`, order)) || {};
    return formUrl;
  }

};

export const order = new Order();

