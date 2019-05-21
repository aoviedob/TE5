import { observer, inject } from 'mobx-react';
import React, { Component } from 'react';
import { Container } from '../../components/Container/Container';
import { CardDeck } from '../../components/CardDeck/CardDeck';
import Invoice from './Invoice';

export default class InvoicesHolder extends Component {

  constructor(props) {
    super(props);
  }

  renderInvoices = invoices => invoices.map((invoice, index) =>
                           <div key={`${event.name}${index}`} className="col-sm-4">
                             <Card className="card-container" image={event.coverImageUrl} title={event.name} subtitle={`${event.addressLine1}${event.addressLine2}`} description={event.metadata.description} >
                               <a className="btn" style={{ marginRight: 10 }} onClick={() => this.goToEventDetails(event)} >
                                 <i class="material-icons icon" style={{ position: 'relative', top: 5 }}>remove_red_eye</i> View
                               </a>
                               <a className="btn" onClick={() => this.buyTicket(event)}>
                                 <i class="material-icons icon" style={{ position: 'relative', top: 5 }}>add_shopping_cart</i>Add to cart
                               </a>
                             </Card>
                           </div>);
 

  render = () => {
    const { src, shouldShowErrorDialog, errorMsg, reservedTickets } = this.props;

    return <CardDeck></CardDeck>;
  };
}
