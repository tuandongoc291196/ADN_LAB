const { checkBookingExists } = require("../bookings/bookingUtils.js");
const { getPaymentByBookingId } = require("../payments/getPayments.js");
const { processMomoRefund } = require("./momoPayment.js");
const {updatePaymentStatus} = require("./updatePayments.js");
const {addBookingHistory} = require("../bookingHistory/addBookingHistory.js");

const refundPayment = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "bookingId is required"
      });
    }

    if (!await checkBookingExists(bookingId)) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Booking not found"
      });
    }

    const paymentDetails = await getPaymentByBookingId(bookingId);
    if (!paymentDetails || paymentDetails.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Payment not found for this booking"
      });
    }

    const payment = paymentDetails[0]; 
    console.log("Payment details for refund:", payment);
    console.log(payment.status);
    
    if (payment.status == "REFUNDED") {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Payment has already been refunded"
      });
    }

    if (payment.status !== "success") {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Payment is not success, cannot process refund"
      });
    }

    let responseData;
    if (payment.paymentMethod === "MOMO") {
      const refundResult = await processMomoRefund(payment.otherDetails[0]);
      console.log("Refund result from MOMO:", refundResult);
      if (!refundResult || refundResult.resultCode !== 0) {
        return res.status(500).json({
          statusCode: 500,
          status: "error",
          message: "Failed to process MOMO refund"
        });
      }

      const updatePaymentStatusDATA = await updatePaymentStatus(bookingId, "REFUNDED", refundResult);
      const addBookingHistoryDATA = await addBookingHistory(bookingId, "REFUNDED", "Payment refunded successfully via MOMO");

      responseData = {
        refund: refundResult,
        payment: updatePaymentStatusDATA,
        bookingHistory: addBookingHistoryDATA
      };

      console.log("Response data for MOMO refund:", responseData);
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Payment refunded successfully",
      data: responseData
    });

  } catch (error) {
    console.error("Error processing refund:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
}

module.exports = {
  refundPayment
};