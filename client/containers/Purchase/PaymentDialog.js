import React, { Component } from 'react';
import Modal from '../../components/Modal/Modal';
import Iframe from '../../components/Iframe/Iframe';
import { observer, inject } from 'mobx-react';

@inject('order', 'ticket')
@observer
export default class PaymentDialog extends Component {

  async checkPayment() {
    const { isPaid } = this.props.order;
    if (!isPaid) return;

    await this.props.ticket.confirmTickets();
  }

  async componentDidUpdate() {
    await this.checkPayment();
  }

  onMoldalClosed = async() => {
    const { isPaid } = this.props;
    if (!isPaid) await this.props.ticket.releaseTickets();
  }

  render = () => {
    const { src } = this.props;
    return (
      <Modal title="" id="paymentModal" modalType="modal fade" contentStyle={{ width: '100%', height: 0, paddingBottom: '56%', position: 'relative' }} onMoldalClosed={this.onMoldalClosed}>
        <Iframe style={{  
          width: '100%',
          height: '100%',
          position: 'absolute',
          display: 'block',
          top: 0,
          left: 0}} 
          src={src} />
      </Modal>
    );
  };
}
