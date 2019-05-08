import React, { Component } from 'react';
import Modal from '../../components/Modal/Modal';
import Iframe from '../../components/Iframe/Modal';

import { observer, inject } from 'mobx-react';
import { action } from 'mobx';


const TIMEOUT_NOTIFICATION_PAYMENT = 60000;

@inject('order')
@observer
export class PaymentDialog extends Component {

  // This is called when we get a postMessage from payment-success or
  // payment-canceled
  handleSuccessfulPay = e => {
    const { onCanceledPay } = this.props;
    logger.debug('got postMessage after redirect');
    if (e.origin.indexOf(window.location.host) >= 0) {
      const message = tryParse(e.data.message, {});
      if (message.action === PAYMENT_TRANSACTION_REDIRECTED) {
        logger.debug('postMessage was success redirect');
        this.onTransactionCompleted();
      }
      if (message.action === PAYMENT_TRANSACTION_CANCELED) {
        logger.debug('postMessage was cancel redirect');
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

  initiatePayment = () => {
    const {
      applicantDetails,
      application: {
        personApplicationId,
        quoteId,
        propertyInfo: { propertyId },
      },
    } = this.props;
    const { model } = this;


    model.initiatePayment(
      {
        invoice: {
         },
        ...applicantDetails,
      },
      personApplicationId,
    );
  };

  onOpening = () => {
    this.startListening();
    this.resetState();
    this.initiatePayment();
  };

  @action
  handleConfirmationTimeout = async () => {
    logger.warn('Timed out waiting for confirmation - will poll one time');
    const paymentCompleted = await this.props.application.fetchPaymentCompleted();
    logger.debug({ paymentCompleted }, 'Back from fetchPaymentCompleted');
    if (paymentCompleted) {
      logger.warn('payment completed but got no notification');
      // parent will be responsible for closing us in this case
      this.props.application.redirectToAdditionalInfo(this.props.auth.token);
    } else {
      logger.warn('payment not completed but got redirect');
      this.waitingForPaymentConfirmation = false;
    }
  };

  cancelPayment = () => {
    logger.trace('cancelPayment');
    const { onCanceledPay } = this.props;
    onCanceledPay && onCanceledPay();
  };

  redirectIfAlreadyPaid = paymentStatus => {
    if (paymentStatus !== INITIATE_PAYMENT_STATUS.ALREADY_PAID) return;

    logger.info('user already paid - redirecting to part 2');
    this.props.application.redirectToAdditionalInfo(this.props.auth.token);
  };

  checkPayment() {
    const { paymentStatus } = this.model;
    this.redirectIfAlreadyPaid(paymentStatus);
  }

  componentDidMount() {
    this.checkPayment();
  }

  componentDidUpdate() {
    this.checkPayment();
  }

  render = () => {
    const { dialogOpen, application, screen } = this.props;
    const { displayingPaymentDialog, waitingForPaymentConfirmation, isAptxUrl } = this;


    return (
      <Modal title={title} id="paymentModal" modalType="modal fade">
        <Iframe src={} />
      </Modal>
    );
  };
}
