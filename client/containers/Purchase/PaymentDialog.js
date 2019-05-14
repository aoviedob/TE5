import React, { Component } from 'react';
import Modal from '../../components/Modal/Modal';
import Iframe from '../../components/Iframe/Iframe';

import { observer, inject } from 'mobx-react';
import { action } from 'mobx';


const TIMEOUT_NOTIFICATION_PAYMENT = 60000;

@inject('order')
@observer
export default class PaymentDialog extends Component {

  // This is called when we get a postMessage from payment-success or
  // payment-canceled
  handleSuccessfulPay = e => {
    const { onCanceledPay } = this.props;
    logger.debug('got postMessage after redirect');
    if (e.origin.indexOf(window.location.host) >= 0) {
      const message = tryParse(e.data.message, {});
      if (message.action === PAYMENT_TRANSACTION_REDIRECTED) {
        this.onTransactionCompleted();
      }
      if (message.action === PAYMENT_TRANSACTION_CANCELED) {
        onCanceledPay && onCanceledPay();
      }
    } else {
      logger.warn({ event: e }, 'Unexpected origin');
    }
  };

  @action
  startListening = () => {
    logger.trace('listening for message events');
    const { listeningForMessage } = this;
    if (!listeningForMessage) {
      // sometimes during debugging, it's possible to have multiple listeners installed
      window.addEventListener('message', this.handleSuccessfulPay, false);

      this.listeningForMessage = true;

      logger.trace('back from adding listener');
    }
  };

  @action
  stopListening = () => {
    logger.trace('no longer listening for message events');
    window.removeEventListener('message', this.handleSuccessfulPay, false);
    this.listeningForMessage = false;
    this.isPaymentIframeLoadingCompleted = false;
  };

  onOpening = () => {
    this.startListening();
    this.resetState();
    this.initiatePayment();
  };

  @action
  handleConfirmationTimeout = async () => {

    const paymentCompleted = await this.props.application.fetchPaymentCompleted();

    if (paymentCompleted) {

      // parent will be responsible for closing us in this case
//      this.props.application.redirectToAdditionalInfo(this.props.auth.token);
    } else {
  
      this.waitingForPaymentConfirmation = false;
    }
  };

  cancelPayment = () => {
    logger.trace('cancelPayment');
    const { onCanceledPay } = this.props;
    onCanceledPay && onCanceledPay();
  };

  redirectIfAlreadyPaid = paymentStatus => {
//  if (paymentStatus !== INITIATE_PAYMENT_STATUS.ALREADY_PAID) return;
  
    this.props.application.redirectToAdditionalInfo(this.props.auth.token);
  };

  checkPayment() {
    //const { paymentStatus } = this.model;
    //this.redirectIfAlreadyPaid(paymentStatus);
  }

  componentDidMount() {
    this.checkPayment();
  }

  componentDidUpdate() {
    this.checkPayment();
  }

  render = () => {
    const { src } = this.props;
    return (
      <Modal title="" id="paymentModal" modalType="modal fade" contentStyle={{ width: '100%', height: 0, paddingBottom: '56%', position: 'relative' }} >
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
