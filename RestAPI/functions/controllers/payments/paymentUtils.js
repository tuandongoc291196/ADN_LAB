const { getPaymentDataMOMO } = require('./momoPayment');
const { getPaymentDataZALOPAY } = require('./zaloPayPayment');
const {addBookingHistory} = require('../bookingHistory/addBookingHistory');
const {updatePaymentStatusByBookingId} = require('./updatePayments');

const checkPaymentStatus = async (paymentMethod, paymentResult) => {
  const maxDuration = 5 * 60 * 1000; 
  const checkInterval = 5 * 1000; 
  const startTime = Date.now();

  console.log(`Starting payment status check for ${paymentMethod} payment`);
  console.log(`Initial payment result:`, paymentResult);

  return new Promise((resolve, reject) => {
    const checkStatus = async () => {
      try {
        const currentTime = Date.now();
        const elapsedTime = currentTime - startTime;

        if (elapsedTime >= maxDuration) {
          console.log('Payment status check timeout - 5 minutes elapsed');
          resolve(false);
          return;
        }

        let statusResult;

        if (paymentMethod === "MOMO") {
          statusResult = await getPaymentDataMOMO(paymentResult.orderId, paymentResult.requestId);
          console.log(`MOMO payment status check at ${new Date().toISOString()}:`, statusResult);

          if (statusResult && statusResult.resultCode === 0) {
            console.log('Payment successful - resultCode is 0');
            resolve(true);
            return;
          }

          if (statusResult && statusResult.resultCode && statusResult.resultCode !== 1000 && statusResult.resultCode !== 7002) {
            console.log(`Payment failed with resultCode: ${statusResult.resultCode}`);
            resolve(false);
            return;
          }
          
        } else if (paymentMethod === "VNPAY") {
          console.log("VNPAY payment status checking not implemented yet");
          resolve(false);
          return;
          
        } else if (paymentMethod === "ZALOPAY") {
          statusResult = await getPaymentDataZALOPAY(paymentResult.app_trans_id);
          console.log(`ZALOPAY payment status check at ${new Date().toISOString()}:`, statusResult);

          if (statusResult && statusResult.return_code === 1) {
            console.log('Payment successful - return_code is 1');
            resolve(true);
            return;
          }

          if (statusResult && statusResult.return_code && statusResult.return_code !== 3) {
            console.log(`Payment failed with return_code: ${statusResult.return_code}`);
            resolve(false);
            return;
          }
          
        } else {
          console.log(`Invalid payment method: ${paymentMethod}`);
          resolve(false);
          return;
        }

        setTimeout(checkStatus, checkInterval);

      } catch (error) {
        console.error('Error checking payment status:', error);
        reject(error);
      }
    };

    checkStatus();
  });
};

const handlePaymentConfirmation = async (bookingId, paymentMethod) => {
  if (!bookingId) {
    throw new Error("bookingId is required for payment confirmation");
  }
  if (!paymentMethod) {
    throw new Error("paymentMethod is required for payment confirmation");
  }

  const paymentConfirmedHistory = await addBookingHistory(bookingId, "PAYMENT_CONFIRMED", "Payment is successful, ", paymentMethod);
  const bookedHistory = await addBookingHistory(bookingId, "BOOKED", "Booking placed successfully");

  return {
    paymentConfirmed: paymentConfirmedHistory,
    booked: bookedHistory
  };
};

const handlePaymentFailure = async (bookingId, paymentMethod) => {
  if (!bookingId) {
    throw new Error("bookingId is required for payment failure handling");
  }
  if (!paymentMethod) {
    throw new Error("paymentMethod is required for payment failure handling");
  }
  
  const paymentFailedHistory = await addBookingHistory(bookingId, "PAYMENT_FAILED", "Payment failed or timed out");
  const pendingHistory = await addBookingHistory(bookingId, "PENDING", "Payment is pending, waiting for user to complete payment", paymentMethod);

  return {
    paymentFailed: paymentFailedHistory,
    pending: pendingHistory
  };
};

const handleRefundConfirmation = async (bookingId, paymentMethod, refundResult) => {
  if (!bookingId) {
    throw new Error("bookingId is required for refund confirmation");
  }
  if (!paymentMethod) {
    throw new Error("paymentMethod is required for refund confirmation");
  }
  if (!refundResult) {
    throw new Error("refundResult is required for refund confirmation");
  }

  const updatePaymentStatusDATA = await updatePaymentStatusByBookingId(bookingId, "REFUNDED", refundResult);
  const addBookingHistoryDATA = await addBookingHistory(bookingId, "REFUNDED", `Payment refunded successfully via ${paymentMethod}`);

  return {
    refund: refundResult,
    payment: updatePaymentStatusDATA,
    bookingHistory: addBookingHistoryDATA
  };
};

module.exports = {
  checkPaymentStatus,
  handlePaymentConfirmation,
  handlePaymentFailure,
  handleRefundConfirmation
};