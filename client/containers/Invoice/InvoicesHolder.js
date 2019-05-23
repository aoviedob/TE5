import { observer, inject } from 'mobx-react';
import React, { Component } from 'react';
import { Container } from '../../components/Container/Container';
import { CardDeck } from '../../components/CardDeck/CardDeck';
import Card from '../../components/Card/Card';
import Invoice from './Invoice';
import Header from '../Header/Header';

@inject('ticket')
@observer
export default class InvoicesHolder extends Component {

  constructor(props) {
    super(props);
  }

  renderInvoices = invoices => invoices.map((invoice, index) =>
                                 <div key={`${invoice.id}${index}`} className="col-sm-6">
                                   <Card><Invoice ticket={invoice}/></Card>
                                 </div>);
 
  render = () => {
    const { invoices = [] } = this.props.ticket;

    return <Container>
             <Header/>
             <CardDeck>{this.renderInvoices(invoices)}</CardDeck>
           </Container>;
  };
}
