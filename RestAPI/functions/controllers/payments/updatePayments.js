const { dataConnect } = require("../../config/firebase.js");

const updatePaymentStatus = async (paymentId, status, otherDetails) => {
  try {

    if (!paymentId) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Payment ID is required"
      });
    }

    if (!status) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "Status is required"
      });
    }

    if (!otherDetails || !Array.isArray(otherDetails)) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "otherDetails must be an array"
      });
    }

    const UPDATE_PAYMENT_STATUS = `
      mutation UpdatePaymentStatus($paymentId: String!, $status: String!, $otherDetails: [String]) {
        payment_update(id: $paymentId, data: {
          status: $status,
          otherDetails: $otherDetails,
          updatedAt_expr: "request.time"
        })
      }
    `;

    console.log("Executing mutation to update payment status:", UPDATE_PAYMENT_STATUS, "with", {
      paymentId: paymentId,
      status: status,
      otherDetails: otherDetails
    });
    const response = await dataConnect.executeGraphql(UPDATE_PAYMENT_STATUS, {
      paymentId: paymentId,
      status: status,
      otherDetails: otherDetails
    });
    
    const responseData = response.data.payment_update;
    console.log("Response data:", responseData);    
    if (!responseData || responseData.length === 0) {
        throw new Error("Payment update failed");
    }

  } catch (error) {
    console.error("Error updating payment status:", error);
    throw new Error("Failed to update payment status due to an internal error");
  }
};

module.exports = {
  updatePaymentStatus,
};