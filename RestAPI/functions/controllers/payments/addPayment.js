const { dataConnect } = require("../../config/firebase.js");
const { processMomoPayment, getPaymentDataMOMO} = require('./momoPayment');
const { processVnpayPayment } = require('./vnpayPayment');
const { processZaloPayPayment } = require('./zaloPayment');
const { checkPaymentStatus } = require('./paymentUtils');
const {checkBookingExists} = require('../bookings/bookingUtils');
const {addBookingHistory} = require('../bookingHistory/addBookingHistory');
const momo = require('../../config/momo');

const addPayment = async (req, res) => {
  try {
    const {bookingId, amount, paymentMethod} = req.body;

    if (!bookingId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "bookingId is required"
      });
    }

    if (!amount) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "amount is required"
      });
    }

    if (!paymentMethod) {
      return res.status(400).json({
        statusCode: 400,
        status: "error", 
        message: "paymentMethod is required"
      });
    }

    if (!await checkBookingExists(bookingId)) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Booking not found"
      });
    }

    const ADD_PAYMENT_MUTATION = `
      mutation CreatePayment($id: String!, $bookingId: String!, $amount: Float!, $paymentMethod: String!, $status: String, $paymentDate: Date, $refundDetail: String, $otherDetails: [String!]) @auth(level: USER) {
        payment_insert(data: {id: $id, bookingId: $bookingId, amount: $amount, paymentMethod: $paymentMethod, status: $status, paymentDate: $paymentDate, refundDetail: $refundDetail, otherDetails: $otherDetails})
      }
    `;
    let result;

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
            await addBookingHistory(bookingId, "booked", "Booking placed successfully");

            const paymentVariables = {
              id: paymentId,
              bookingId: bookingId,
              amount: parseFloat(amount),
              paymentMethod: "MOMO",
              status: "success",
              paymentDate: new Date().toISOString(),
              refundDetail: null,
              otherDetails: [JSON.stringify(result)]
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
            await addBookingHistory(bookingId, "pending", "Payment failed or timed out");
          }
        })
        .catch(error => {
          console.error('Error in payment status checking:', error);
        });

      return res.status(200).json({
        statusCode: 200,
        status: "success",
        essage: "Payment initiated. Status will be checked automatically for 15 minutes.",
        data: result
      });
      
    } else {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Invalid payment choice. Supported options: MOMO"
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