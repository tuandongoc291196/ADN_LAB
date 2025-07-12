const { dataConnect } = require("../../config/firebase.js");

const deletePayment = async (paymentId) => {
    try {
        if (!paymentId) {
            throw new Error("paymentId is required for deletion");
        }

        const DELETE_PAYMENT_MUTATION = `
            mutation DeletePayment($id: String!) @auth(level: USER) {
                payment_delete(key: {id: $id})
            }
        `;

        const variables = {
            id: paymentId
        };

        console.log("Executing mutation to delete payment:", DELETE_PAYMENT_MUTATION, "with", variables);
        const response = await dataConnect.executeGraphql(DELETE_PAYMENT_MUTATION, { variables: variables });
        
        const responseData = response.data.payment_delete;
        if (!responseData) {
            throw new Error("Payment deletion failed or payment not found");
        }
        
        console.log("Payment deleted successfully:", responseData);
    } catch (error) {
        console.error("Error in deletePayment:", error);
        throw new Error("Failed to delete payment due to an internal error");
    }
}

const deletePaymentByBookingId = async (bookingId) => {
    try {
        if (!bookingId) {
            throw new Error("paymentId is required for deletion");
        }

        const DELETE_PAYMENT_MUTATION = `
            mutation DeletePayment($bookingId: String!) @auth(level: USER) {
                payment_deleteMany(where: {bookingId: {eq: $bookingId}})
            }
        `;

        const variables = {
            bookingId: bookingId
        };

        console.log("Executing mutation to delete payment:", DELETE_PAYMENT_MUTATION, "with", variables);
        const response = await dataConnect.executeGraphql(DELETE_PAYMENT_MUTATION, { variables: variables });
        
        const responseData = response.data.payment_deleteMany;
        if (!responseData) {
            throw new Error("Payment deletion failed or payment not found");
        }
        
        console.log("Payment deleted successfully:", responseData);
    } catch (error) {
        console.error("Error in deletePayment:", error);
        throw new Error("Failed to delete payment due to an internal error");
    }
}

module.exports = {
    deletePayment,
    deletePaymentByBookingId
};