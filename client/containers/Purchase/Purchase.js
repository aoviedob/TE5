import React, { Component } from 'react';
import { inject, observer } from 'mobx-react';
import { Container } from '../../components/Container/Container';
import Header from '../Header/Header';
import Dropdown from '../../components/Dropdown/Dropdown';
import PaymentDialog from './PaymentDialog';

@inject('auth', 'order', 'customer', 'ticketCategory', 'event', 'eventOrganizer')
@observer
export default class Purchase extends Component {

  constructor(props) {
    super(props);
  }

  async componentDidMount() {
    const customer = await this.props.customer.getCustomerByEmail(this.props.auth.email);
    await this.props.order.setCustomerId(customer.id);
    await this.props.order.getPendingOrder();
  	await this.props.ticketCategory.getCategories();
    await this.props.event.getAllEvents();
    await this.props.eventOrganizer.getEventOrganizers();
  }

  onTicketCategorySelected = async ({ id: externalProductCategoryId }, orderLine, quantity) => {
    if (!externalProductCategoryId) return;
    await this.props.order.updateOrderLine({ ...orderLine, externalProductCategoryId, quantity });
  };
  
  onQuantityChange = async(e, orderLine) => {
    const quantity = e.target.value;
    const { quantity: currentQuantity } = orderLine;
    
    if ( currentQuantity === quantity) return;

    orderLine.quantity = quantity;
    await this.props.order.updateOrderLine({ ...orderLine, quantity });
  };

  onRemove = async(orderLine) => {
    await this.props.order.removeOrderLine(orderLine);
  }

  renderOrderLines = orderLines => orderLines.map(orderLine => {
    const { id, externalProductName, externalProductId, quantity, externalProductCategoryId } = orderLine;
    const { ticketCategory, event, eventOrganizer } = this.props;
    const { ticketCategories = [] } = ticketCategory;
    const { eventOrganizers = [] } = eventOrganizer;
    const { events = [] } = event;
    if(!events.length || !ticketCategories.length || !eventOrganizers.length) return <div></div>;

    const orderEvent = events.find(e => e.id === externalProductId);
    const { coverImageUrl, eventOrganizerId } = orderEvent;

    const orderEventOrganizer = eventOrganizers.find(o => o.id === eventOrganizerId);
    const { name: organizerName } = orderEventOrganizer;

    const orderEventCategories = ticketCategories.filter(t => t.externalEventId === externalProductId);
    const { price, available } = ticketCategories.find(tc => tc.id === externalProductCategoryId);

    return <tr key={`orderLine-${id}`}>
      <td className="col-sm-12 col-md-5">
        <div className="media">
          <a className="thumbnail pull-left" href="#"> <img className="media-object" src={coverImageUrl} style={{ width: 72, height: 72 }}/> </a>
            <div className="media-body">
              <h4 className="media-heading"><a href="#">{externalProductName}</a></h4>
              <h5 className="media-heading"> by <a href="#">{organizerName}</a></h5>
              <span>Available: </span><span className="text-success"><strong>{available}</strong></span>
            </div>
        </div>
      </td>
      <td className="col-sm-6 col-md-2" style={{ textAlign: 'center'}}>
        <Dropdown items={orderEventCategories} selectedId={externalProductCategoryId} onOptionSelected={async item => await this.onTicketCategorySelected(item, orderLine, quantity)} defaultItem={{name: 'Select Ticket Category' }} />
      </td>
      <td className="col-sm-6 col-md-2" style={{ textAlign: 'center'}}>
        <input type="number" min="1" max={available} className="form-control" onChange={async e => await this.onQuantityChange(e, orderLine)} value={quantity}/>
      </td>
      <td className="col-sm-1 col-md-1 text-center"><strong>${price}</strong></td>
      <td className="col-sm-1 col-md-1 text-center"><strong>${price * quantity }</strong></td>
      <td className="col-sm-1 col-md-1">
        <button type="button" className="btn btn-danger" onClick={() => this.onRemove(orderLine)}>
          <span className="glyphicon glyphicon-remove"></span> Remove
        </button>
      </td>
    </tr>;
  });

  renderHeaders = () =>
    <thead>
      <tr>
        <th>Product</th>
        <th>Category</th>
        <th>Quantity</th>
        <th className="text-center">Price</th>
        <th className="text-center">Total</th>
      </tr>
    </thead>;

  onContinueClicked = () => window.location.replace('/');

  initiatePayment = async () => {
    console.log('aaa');
    await this.props.order.initiatePayment();
  };

  render() {
    const { customerOrder } = this.props.order;
    const { orderLines = [], totalAmount = 0 } = customerOrder || {};

    return (<Container>
              <Header></Header>
              <div className="row">
                <div className="col-sm-12 col-md-12 col-md-offset-1">
                  <table className="table table-hover">
                    {this.renderHeaders()}
                    <tbody>
                    {orderLines.length > 0 && this.renderOrderLines(customerOrder.orderLines)}
                    <tr>
                      <td>   </td>
                      <td>   </td>
                      <td>   </td>
                      <td><h3>Total</h3></td>
                      <td className="text-right"><h3><strong>${totalAmount}</strong></h3></td>
                    </tr>
                    <tr>
                      <td>   </td>
                      <td>   </td>
                      <td>   </td>
                      <td>
                        <button type="button" className="btn btn-default" onClick={() => this.onContinueClicked()}>
                          <span className="glyphicon glyphicon-shopping-cart"></span> Continue Shopping
                        </button>
                      </td>
                      <td>
                        <button disabled={orderLines.length < 1} type="button" className="btn btn-success" data-toggle="modal" data-target="#paymentModal" onClick={this.initiatePayment}>
                          Checkout <span className="glyphicon glyphicon-play"></span>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
        <PaymentDialog/>
      </Container>);
  }

}