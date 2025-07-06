const { checkBookingExists } = require("../bookings/bookingUtils.js");
const { getPaymentByBookingId } = require("../payments/getPayments.js");
const { processMomoRefund } = require("./momoPayment.js");
const { processZaloPayRefund } = require("./zaloPayPayment.js");
const {handleRefundConfirmation} = require("./paymentUtils.js");

const refundPayment = async (req, res) => {
  try {
    const { bookingId, refundAmount } = req.body;

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

    if (!refundAmount || isNaN(refundAmount) || refundAmount <= 0) {
      return res.status(400).json({        
        statusCode: 400,
        status: "error",
        message: "Valid refundAmount is required for refund"
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

    if (payment.status !== "SUCCESS") {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Payment is not success, cannot process refund"
      });
    }

    let responseData;
    if (payment.paymentMethod === "MOMO") {
      const refundResult = await processMomoRefund(payment.otherDetails[0], refundAmount);
      console.log("Refund result from MOMO:", refundResult);
      if (!refundResult || refundResult.resultCode !== 0) {
        return res.status(500).json({
          statusCode: 500,
          status: "error",
          message: "Failed to process MOMO refund"
        });
      }

      responseData = await handleRefundConfirmation(bookingId, "MOMO", refundResult);

      console.log("Response data for MOMO refund:", responseData);
    } else if (payment.paymentMethod === "ZALOPAY") {
        const refundResult = await processZaloPayRefund(payment.otherDetails[0], refundAmount);
        console.log("Refund result from ZALOPAY:", refundResult);
        if (!refundResult || refundResult.return_code !== 1) {
          return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Failed to process ZALOPAY refund"
          });
        }

        responseData = await handleRefundConfirmation(bookingId, "ZALOPAY", refundResult);

        console.log("Response data for ZALOPAY refund:", responseData);
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

const refundPaymentByBookingId = async (bookingId, refundAmount) => {
    try {
        if (!bookingId) {
            throw new Error("bookingId is required");
        }

        if (!refundAmount) {
            throw new Error("refundAmount is required");
        }

        const payment = paymentDetails[0]; 
        console.log("Payment details for refund:", payment);
        console.log(payment.status);
        
        if (payment.status == "REFUNDED") {
            throw new Error("Payment has already been refunded");
        }

        if (payment.status !== "SUCCESS") {
            throw new Error("Payment is not success, cannot process refund");
        }

        let responseData;
        if (payment.paymentMethod === "MOMO") {
            const refundResult = await processMomoRefund(payment.otherDetails[0], refundAmount);
            console.log("Refund result from MOMO:", refundResult);
            if (!refundResult || refundResult.resultCode !== 0) {
                throw new Error("Failed to process MOMO refund");
            }

            responseData = await handleRefundConfirmation(bookingId, "MOMO", refundResult);
            console.log("Response data for MOMO refund:", responseData);
        } else if (payment.paymentMethod === "ZALOPAY") {
            const refundResult = await processZaloPayRefund(payment.otherDetails[0], refundAmount);
            console.log("Refund result from ZALOPAY:", refundResult);
            if (!refundResult || refundResult.return_code !== 1) {
                throw new Error("Failed to process ZALOPAY refund");
            }

            responseData = await handleRefundConfirmation(bookingId, "ZALOPAY", refundResult);
            console.log("Response data for ZALOPAY refund:", responseData);
        }

        console.log("Payment refunded successfully:", responseData);
        return responseData;

    } catch (error) {
        console.error("Error processing refund:", error);
        throw new Error("Failed to process refund due to an internal error");
    }
}

module.exports = {
  refundPayment,
  refundPaymentByBookingId
};