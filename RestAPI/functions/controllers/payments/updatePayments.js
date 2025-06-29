const { dataConnect } = require("../../config/firebase.js");

const updatePaymentStatus = async (bookingId, status, otherDetails) => {
  try {

    if (!bookingId) {
      throw new Error("bookingId is required");
    }

    if (!status) {
      throw new Error("status is required");
    }

    if (!otherDetails) {
      throw new Error("otherDetails is required");
    }

    const UPDATE_PAYMENT_STATUS = `
      mutation UpdatePaymentStatus($bookingId: String!, $status: String!, $otherDetails: [String!]) {
        payment_updateMany(where: {bookingId: {eq: $bookingId}}, data: {
          status: $status,
          otherDetails: $otherDetails,
          updatedAt_expr: "request.time"
        })
      }
    `;

    const variables = {
      bookingId: bookingId,
      status: status,
      otherDetails: [JSON.stringify(otherDetails)]
    };
    console.log("Executing mutation to update payment status:", UPDATE_PAYMENT_STATUS, "with", variables);
    const response = await dataConnect.executeGraphql(UPDATE_PAYMENT_STATUS, {
      variables: variables
    });
    
    console.log("Response from update payment status:", response);
    const responseData = response.data.payment_updateMany;
    console.log("Response data:", responseData);    
    if (!responseData || responseData.length === 0) {
        throw new Error("Payment update failed");
    }
    return responseData;
  } catch (error) {
    console.error("Error updating payment status:", error);
    throw new Error("Failed to update payment status due to an internal error");
  }
};

module.exports = {
  updatePaymentStatus,
};