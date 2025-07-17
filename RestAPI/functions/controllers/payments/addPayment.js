const { dataConnect } = require("../../config/firebase.js");
const { processMomoPayment, getPaymentDataMOMO} = require('./momoPayment');
const { processZaloPayPayment, getPaymentDataZALOPAY } = require('./zaloPayPayment.js');
const {getOneBookingById} = require('../bookings/getBookings');
const {checkBookingExists} = require('../bookings/bookingUtils');
const {addBookingHistory} = require('../bookingHistory/addBookingHistory');
const {updatePaymentStatus} = require('./updatePayments');
const {deletePayment} = require('./deletePayment');
const {getPaymentByBookingId} = require('./getPayments');
const { checkPaymentStatus, handlePaymentConfirmation, handlePaymentFailure } = require('./paymentUtils');

const addPaymentToDatabase = async (paymentId, bookingId, amount, paymentMethod, otherDetails, status) => {
  if (!paymentId) {
    throw new Error("paymentId is required for database insertion");
  }
  if (!bookingId) {
    throw new Error("bookingId is required for database insertion");
  }
  if (!amount || amount <= 0) {
    throw new Error("Valid amount is required for database insertion");
  }
  if (!paymentMethod) {
    throw new Error("paymentMethod is required for database insertion");
  }
  if (!otherDetails) {
    throw new Error("otherDetails is required for database insertion");
  }

  const ADD_PAYMENT_MUTATION = `
    mutation CreatePayment($id: String!, $bookingId: String!, $amount: Float!, $paymentMethod: String!, $status: String, $paymentDate: Date, $refundDetail: String, $otherDetails: [String!]) @auth(level: USER) {
      payment_insert(data: {id: $id, bookingId: $bookingId, amount: $amount, paymentMethod: $paymentMethod, status: $status, paymentDate: $paymentDate, refundDetail: $refundDetail, otherDetails: $otherDetails})
    }
  `;
  
  const paymentVariables = {
    id: paymentId,
    bookingId: bookingId,
    amount: parseFloat(amount),
    paymentMethod: paymentMethod,
    status: status,
    paymentDate: new Date().toISOString(),
    refundDetail: null,
    otherDetails: [JSON.stringify(otherDetails)]
  };

  const response = await dataConnect.executeGraphql(ADD_PAYMENT_MUTATION, {
    variables: paymentVariables
  });
  const responseData = response.data.payment_insert;
  if (!responseData) {
    throw new Error("Failed to add payment record");
  }
  console.log("Payment record added successfully:", responseData);
};

const addPayment = async (req, res) => {
  try {
    const {bookingId, paymentMethod} = req.body;

    if (!bookingId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "bookingId is required"
      });
    }

    if (!paymentMethod || (paymentMethod !== "MOMO" && paymentMethod !== "ZALOPAY" && paymentMethod !== "CASH")) {
      return res.status(400).json({
        statusCode: 400,
        status: "error", 
        message: "paymentMethod is required, must be one of: MOMO/ZALOPAY/CASH"
      });
    }

    if (!await checkBookingExists(bookingId)) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Booking not found"
      });
    }

    const record = await getOneBookingById(bookingId);
    console.log("Data for booking:", record);

    const bookingHistory = record.bookingHistories_on_booking;
    if (bookingHistory && bookingHistory.length > 0) {
      const latestStatus = bookingHistory[0].status;
      console.log("Latest booking status:", latestStatus);
      if (!(latestStatus === "PENDING")) {
        if (latestStatus === "PENDING_PAYMENT") {
          console.log("Booking is already pending payment, proceeding with payment processing");
          const existingPayment = await getPaymentByBookingId(bookingId);
          
          let paymentUrl = null;
          if (existingPayment && existingPayment.length > 0 && existingPayment[0].otherDetails) {
            try {
              const otherDetails = JSON.parse(existingPayment[0].otherDetails[0]);
              const paymentMethod = existingPayment[0].paymentMethod;
              
              if (paymentMethod === "MOMO") {
                paymentUrl = otherDetails.payUrl;
              } else if (paymentMethod === "ZALOPAY") {
                paymentUrl = otherDetails.order_url;
              }
            } catch (error) {
              console.error("Error parsing otherDetails:", error);
            }
          }
          
          return res.status(200).json({
            statusCode: 200,
            status: "SUCCESS",
            message: "Booking is already pending payment, proceeding with payment processing",
            data: paymentUrl || existingPayment
          });
        }``
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Booking is not in a valid state for payment. Current status: " + latestStatus
        });
      }
    }

    const amount = record.totalAmount;
    if (!amount) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Booking does not have a valid total amount"
      });
    }
    
    console.log("Booking amount:", amount);
    let result;
    await addBookingHistory(bookingId, "PENDING_PAYMENT", "Payment is pending, waiting for user to complete payment", paymentMethod);
    if (paymentMethod === "MOMO") {
      console.log("Making MOMO payment");
      console.log(req.body);
      const paymentId = `MOMO_${bookingId}_${new Date().getTime()}`;
      result = await processMomoPayment(amount, paymentId);
      console.log(result);
      await addPaymentToDatabase(paymentId, bookingId, amount, paymentMethod, result, "PENDING");

      checkPaymentStatus('MOMO', result)
        .then(async (isSuccessful) => {
          if (isSuccessful) {
            console.log('Payment confirmed successfully');
            const otherDetails = await getPaymentDataMOMO(result.orderId, result.requestId);
            const confirmationResult = await handlePaymentConfirmation(bookingId, paymentMethod);
            await updatePaymentStatus(paymentId, "SUCCESS", otherDetails);
            console.log("Response data for MOMO payment confirmation:", confirmationResult);
          } else {
            console.log('Payment failed or timed out');
            await deletePayment(paymentId);
            const failureResult = await handlePaymentFailure(bookingId, paymentMethod);
            console.log("Response data for MOMO payment failure:", failureResult);
          }
        })
        .catch(error => {
          console.error('Error in payment status checking:', error);
        });

      return res.status(200).json({
        statusCode: 200,
        status: "SUCCESS",
        message: "MOMO payment initiated. Status will be checked automatically for 5 minutes.",
        data: result.payUrl
      });
    } else if (paymentMethod === "ZALOPAY") {
      console.log("Making ZALOPAY payment");
      const paymentId = `ZALOPAY_${bookingId}_${new Date().getTime()}`;
      result = await processZaloPayPayment(amount, paymentId);
      console.log(result);
      await addPaymentToDatabase(paymentId, bookingId, amount, paymentMethod, result, "PENDING");

      checkPaymentStatus('ZALOPAY', result)
        .then(async (isSuccessful) => {
          if (isSuccessful) {
            console.log('Payment confirmed successfully');
            const otherDetails = await getPaymentDataZALOPAY(result.app_trans_id);
            const confirmationResult = await handlePaymentConfirmation(bookingId, paymentMethod);
            await updatePaymentStatus(paymentId, "SUCCESS", otherDetails);
            console.log("Response data for ZALOPAY payment confirmation:", confirmationResult);
          } else {
            console.log('Payment failed or timed out');
            await deletePayment(paymentId);
            const failureResult = await handlePaymentFailure(bookingId, paymentMethod);
            console.log("Response data for ZALOPAY payment failure:", failureResult);
          }
        })
        .catch(error => {
          console.error('Error in payment status checking:', error);
        });

      return res.status(200).json({
        statusCode: 200,
        status: "SUCCESS",
        message: "ZALOPAY payment initiated. Status will be checked automatically for 5 minutes.",
        data: result.order_url
      });
    } else if (paymentMethod === "CASH") {
      console.log("Making CASH payment");
      const paymentId = `CASH_${bookingId}_${new Date().getTime()}`;
      const cashPaymentDetails = {
        bookingId: bookingId,
        amount: amount,
        paymentMethod: "CASH",
        paymentId: paymentId
      };
      await addPaymentToDatabase(paymentId, bookingId, amount, paymentMethod, cashPaymentDetails, "PENDING");
      return res.status(200).json({
        statusCode: 200,
        status: "SUCCESS",
        message: "Cash payment selected. Please complete the payment in person.",
        data: {
          bookingId: bookingId,
          amount: amount,
          paymentMethod: "CASH"
        }
      });
    } else {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Invalid payment choice. Supported options: MOMO/ZALOPAY/CASH"
      });
    }
    
  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({
      statusCode: 500,
      status: "error",
      message: error.message
    });
  }
};

module.exports = { addPayment };