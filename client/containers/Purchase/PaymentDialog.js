import React, { Component } from 'react';
import Modal from '../../components/Modal/Modal';
import Iframe from '../../components/Iframe/Iframe';
import { observer, inject } from 'mobx-react';

@inject('order', 'ticket')
@observer
export default class PaymentDialog extends Component {

  constructor(props) {
    super(props);
  }

  async checkPayment() {
    const { isPaid } = this.props;
    if (!isPaid) return;
    await this.props.ticket.confirmTickets();
    $('.close').click();
  }

  async componentDidUpdate(prevProps) {
    if (prevProps.isPaid !== this.props.isPaid) {
      await this.checkPayment();
    }
  }

  onMoldalClosed = async() => {
    const { shouldShowErrorDialog, isPaid } = this.props;
    if (!shouldShowErrorDialog && !isPaid) await this.props.ticket.releaseTickets();

    this.props.order.setShowErrorDialog(false);
  }

  render = () => {
    const { src, shouldShowErrorDialog, errorMsg, reservedTickets } = this.props;

    return (
      <Modal title="" id="paymentModal" modalType="modal fade" contentStyle={{ width: '100%', height: 0, paddingBottom: '56%', position: 'relative' }} onMoldalClosed={this.onMoldalClosed}>
        {!shouldShowErrorDialog && reservedTickets.length > 0 && <Iframe style={{  
          width: '100%',
          height: '100%',
          position: 'absolute',
          display: 'block',
          top: 0,
          left: 0}} 
          src={src} />}
        {shouldShowErrorDialog && <h4>{errorMsg}</h4>}
      </Modal>
    );
  };
}
