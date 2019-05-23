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
    this.state = {};
  }

  print = invoice => {
  	this.setState({ invoice });
  }

  renderInvoices = invoices => invoices.map((invoice, index) =>
                                 <div key={`${invoice.id}${index}`} className="col-sm-6">
                                   <Card>
                                     <Invoice ticket={invoice}/>
                                     <a className="btn" style={{ marginRight: 10 }} onClick={() => this.print(invoice)} >
                                       <i class="material-icons icon" style={{ position: 'relative', top: 5 }}>print</i> Print
                                     </a>
                                   </Card>
                                 </div>);
 
  render = () => {
    const { invoices = [] } = this.props.ticket;
    const { invoice } = this.state;

    return <Container>
             {!invoice && <Header/>}
             {!invoice && <CardDeck>{this.renderInvoices(invoices)}</CardDeck>}
             {invoice && <div className="col-sm-12"><Invoice showPrint={true} ticket={invoice}/></div>}
           </Container>;
  };
}
