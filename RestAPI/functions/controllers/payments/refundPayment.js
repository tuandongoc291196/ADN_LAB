const { dataConnect } = require("../../config/firebase.js");
const { checkBookingExists } = require("../bookings/bookingUtils.js");
const { getPaymentByBookingId } = require("../payments/getPayments.js");

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
    if (!paymentDetails) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Payment not found for this booking"
      });
    }

    console.log("Payment details for refund:", paymentDetails);
    if (paymentDetails.status !== "success") {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Payment is not success, cannot process refund"
      });
    }

    if (paymentDetails.paymentMethod === "MOMO") {
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Payment refunded successfully",
      data: ""
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