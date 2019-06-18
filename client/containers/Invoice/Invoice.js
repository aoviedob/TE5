import React, { Component } from 'react';
import { observer, inject } from 'mobx-react';
import moment from 'moment';
import './Invoice.css';

@inject('ticketCategory', 'event', 'customer', 'eventOrganizer', 'comm')
@observer
export default class Invoice extends Component {

  constructor(props) {
    super(props);
    this.state = { invoice: {} };
  }

  async componentWillMount() {
    const { ticket } = this.props;
    const { invoiceId, ticketCategoryId, externalCustomerId, couponId, finalPrice, createdAt  } = ticket;
    
    const { name: categoryName, price: categoryPrice, externalEventId } = await this.props.ticketCategory.getCategoryById(ticketCategoryId);
    const { name: eventName, coverImageUrl, startDate, endDate, eventOrganizerId } = await this.props.event.getEventById(externalEventId);
    const { name: eventOrganizerName } = await this.props.eventOrganizer.getOrganizer(eventOrganizerId);
    const { fullname: customerName, email: customerEmail } = await this.props.customer.getCustomerById(externalCustomerId);

    const invoice = { 
      id: invoiceId,
      startDate,
      endDate,
      eventName,
      coverImageUrl,
      createdAt, 
      eventOrganizerName,
      categoryName,
      categoryPrice,
      customerName,
      customerEmail,
      finalPrice
    };
    
    await this.props.comm.sendEmail({ email: customerEmail, template: 'INVOICE_CONFIRMATION' , data: { invoice } });

    this.setState({ invoice }, () => {
      if(!this.props.showPrint) return;
      
      window.print();
    });
  }

  render = () => {

    const { invoice } = this.state;
    const { id, startDate, endDate, coverImageUrl, createdAt, eventName, eventOrganizerName, customerName, customerEmail, categoryName, categoryPrice, finalPrice } = invoice;

    return (
        <div className="row">
          <div className="col-12">
            <div className="card">
                <div className="card-body p-0">
                    <div className="row p-5">
                        <div className="col-md-6">
                            <img src={coverImageUrl} className="d-block img-fluid" />
                        </div>

                        <div className="col-md-6 text-right">
                            <p className="font-weight-bold mb-1">{`Invoice #${id}`}</p>
                            <p className="text-muted">{`Due to: ${moment(createdAt).format('llll')}`}</p>
                        </div>
                    </div>

                    <hr className="my-5"/>

                    <div className="row pb-5 p-5">
                        <div className="col-md-6">
                          <p className="font-weight-bold mb-4">Event Details</p>
                          <p className="mb-1 invoice-text"><span className="text-muted ">Name: </span>{eventName}</p>
                          <p className="mb-1 invoice-text"><span className="text-muted">Organizer: </span>{eventOrganizerName}</p>
                          <p className="mb-1 invoice-text"><span className="text-muted">Start Date: </span>{moment(startDate).format('llll')}</p>
                          <p className="mb-1 invoice-text"><span className="text-muted">End Date: </span>{moment(endDate).format('llll')}</p>
                        </div>

                        <div className="col-md-6 text-right">
                          <p className="font-weight-bold mb-4">Client Information</p>
                          <p className="mb-1 invoice-text">{customerName}</p>
                          <p className="mb-1 invoice-text">{customerEmail}</p>
                        </div>
                    </div>

                    <div className="row p-5">
                        <div className="col-md-12">
                            <table className="table">
                                <thead>
                                    <tr>
                                        <th className="border-0 text-uppercase small font-weight-bold">Category</th>
                                        <th className="border-0 text-uppercase small font-weight-bold">Price</th>
                                        <th className="border-0 text-uppercase small font-weight-bold">Coupon</th>
                                        <th className="border-0 text-uppercase small font-weight-bold">Total</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <tr>
                                        <td>{categoryName}</td>
                                        <td>{categoryPrice}</td>
                                        <td>LTS Versions</td>
                                        <td>{finalPrice}</td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className="d-flex flex-row-reverse bg-dark text-white p-4">
                        <div className="py-2 px-2 text-right">
                            <div className="mb-2">Grand Total</div>
                            <div className="h3 font-weight-light">{finalPrice}</div>
                        </div>

                        <div className="py-2 px-2 text-right">
                            <div className="mb-2">Discount</div>
                            <div className="h3 font-weight-light">10%</div>
                        </div>

                        <div className="py-2 px-2 text-right">
                            <div className="mb-2">Sub - Total amount</div>
                            <div className="h3 font-weight-light">{categoryPrice}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>    
    );
  };
}
