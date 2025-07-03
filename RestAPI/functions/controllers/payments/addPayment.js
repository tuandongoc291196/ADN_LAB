const { dataConnect } = require("../../config/firebase.js");
const { processMomoPayment} = require('./momoPayment');
const { processZaloPayPayment, getPaymentDataZALOPAY } = require('./zaloPayPayment.js');
const { checkPaymentStatus } = require('./paymentUtils');
const {checkBookingExists} = require('../bookings/bookingUtils');
const {addBookingHistory} = require('../bookingHistory/addBookingHistory');
const {getOneBookingById} = require('../bookings/getBookings');
const {getBookingHistoryByBookingId} = require('../bookingHistory/getBookingHistory');
const {getPaymentDataMOMO} = require("./momoPayment.js");

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

    const bookingHistory = await getBookingHistoryByBookingId(bookingId);
    if (bookingHistory && bookingHistory.length > 0) {
      const latestStatus = bookingHistory[0].status;
      console.log("Latest booking status:", latestStatus);
      if (!(latestStatus === "PENDING")) {
        if (latestStatus === "PENDING_PAYMENT") {
          return res.status(400).json({
            statusCode: 400,
            status: "error",
            message: "Booking is already pending payment"
          });
        }
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Booking is not in a valid state for payment. Current status: " + latestStatus
        });
      }
    }

    const ADD_PAYMENT_MUTATION = `
      mutation CreatePayment($id: String!, $bookingId: String!, $amount: Float!, $paymentMethod: String!, $status: String, $paymentDate: Date, $refundDetail: String, $otherDetails: [String!]) @auth(level: USER) {
        payment_insert(data: {id: $id, bookingId: $bookingId, amount: $amount, paymentMethod: $paymentMethod, status: $status, paymentDate: $paymentDate, refundDetail: $refundDetail, otherDetails: $otherDetails})
      }
    `;

    const record = await getOneBookingById(bookingId);
    console.log("Data for booking:", record);

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

      checkPaymentStatus('MOMO', result)
        .then(async (isSuccessful) => {
          if (isSuccessful) {
            console.log('Payment confirmed successfully');
            await addBookingHistory(bookingId, "PAYMENT_CONFIRMED", "Payment is successful, ", paymentMethod);
            await addBookingHistory(bookingId, "BOOKED", "Booking placed successfully");
            const otherDetails = await getPaymentDataMOMO(result.orderId, result.requestId);
            console.log("Other details from MOMO:", otherDetails);
            const paymentVariables = {
              id: paymentId,
              bookingId: bookingId,
              amount: parseFloat(amount),
              paymentMethod: "MOMO",
              status: "SUCCESS",
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
          } else {
            console.log('Payment failed or timed out');
            await addBookingHistory(bookingId, "PAYMENT_FAILED", "Payment failed or timed out");
            await addBookingHistory(bookingId, "PENDING", "Payment is pending, waiting for user to complete payment", paymentMethod);
          }
        })
        .catch(error => {
          console.error('Error in payment status checking:', error);
        });

      return res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "MOMO payment initiated. Status will be checked automatically for 15 minutes.",
        data: result.payUrl
      });
    } else if (paymentMethod === "ZALOPAY") {
      console.log("Making ZALOPAY payment");
      const paymentId = `ZALOPAY_${bookingId}_${new Date().getTime()}`;
      result = await processZaloPayPayment(amount, paymentId);
      console.log(result);

      checkPaymentStatus('ZALOPAY', result)
        .then(async (isSuccessful) => {
          if (isSuccessful) {
            console.log('Payment confirmed successfully');
            await addBookingHistory(bookingId, "PAYMENT_CONFIRMED", "Payment is successful, ", paymentMethod);
            await addBookingHistory(bookingId, "BOOKED", "Booking placed successfully");
            const otherDetails = await getPaymentDataZALOPAY(result.app_trans_id);
            console.log("Other details from ZALOPAY:", otherDetails);
            const paymentVariables = {
              id: paymentId,
              bookingId: bookingId,
              amount: parseFloat(amount),
              paymentMethod: "ZALOPAY",
              status: "success",
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
          } else {
            console.log('Payment failed or timed out');
            await addBookingHistory(bookingId, "PAYMENT_FAILED", "Payment failed or timed out");
            await addBookingHistory(bookingId, "PENDING", "Payment is pending, waiting for user to complete payment", paymentMethod);
          }
        })
        .catch(error => {
          console.error('Error in payment status checking:', error);
        });

      return res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "ZALOPAY payment initiated. Status will be checked automatically for 15 minutes.",
        data: result.order_url
      });
    } else if (paymentMethod === "CASH") {
      console.log("Making CASH payment");
      await addBookingHistory(bookingId, "BOOKED", "Booking placed successfully");
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