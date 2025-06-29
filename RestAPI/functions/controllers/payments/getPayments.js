const { dataConnect } = require("../../config/firebase.js");
const { checkBookingExists } = require("../bookings/bookingUtils.js");

const getAllPayments = async (req, res) => {
  
  try {
    const GET_ALL_PAYMENT = `
      query GetAllPayments {
        payments {
          id
          bookingId
          booking {
            id
          }
          amount
          paymentMethod
          status
          paymentDate
          refundDetail
          otherDetails
          createdAt
          updatedAt
        }
      }
    `;

    console.log("Executing query to fetch all payments:", GET_ALL_PAYMENT);
    const response = await dataConnect.executeGraphql(GET_ALL_PAYMENT);
    
    const responseData = response.data.payments;
    console.log("Response data:", responseData);
    if (!responseData || responseData.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "No payments found"
      });
    }
    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Payments retrieved successfully",
      data: responseData,
    });

  } catch (error) {
    console.error("Error fetching payments:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const getBookingPayments = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        statusCode: 400,
        success: false,
        message: "bookingId is required"
      });
    }

    if (!await checkBookingExists(bookingId)) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "Booking not found"
      });
    }

    const GET_BOOKING_PAYMENT = `
      query GetBookingPayment($bookingId: String!) {
        payments(where: {bookingId: {eq: $bookingId}}) {
          id
          amount
          paymentMethod
          status
          paymentDate
          refundDetail
          otherDetails
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      bookingId: bookingId
    };

    console.log("Executing query to fetch booking payments:", GET_BOOKING_PAYMENT, "with", bookingId);
    const response = await dataConnect.executeGraphql(GET_BOOKING_PAYMENT, {
      variables: variables
    });
    
    const responseData = response.data.payments;
    console.log("Response data:", responseData);
    
    if (!responseData || responseData.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        success: false,
        message: "No payments found for this booking"
      });
    }

    res.status(200).json({
      statusCode: 200,
      success: true,
      message: "Booking payments retrieved successfully",
      data: responseData,
    });

  } catch (error) {
    console.error("Error fetching booking payments:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message
    });
  }
};

const getPaymentByBookingId = async (bookingId) => {
  try {
    if (!bookingId) {
      throw new Error("Booking ID is required");
    }

    const GET_PAYMENT_BY_BOOKING_ID = `
      query GetPaymentByBookingId($bookingId: String!) {
        payments(where: {bookingId: {eq: $bookingId}}) {
          id
          amount
          paymentMethod
          status
          paymentDate
          refundDetail
          otherDetails
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      bookingId: bookingId
    };

    console.log("Executing query to fetch payment by booking ID:", GET_PAYMENT_BY_BOOKING_ID, "with", bookingId);
    const response = await dataConnect.executeGraphql(GET_PAYMENT_BY_BOOKING_ID, {
      variables: variables
    });
    
    const responseData = response.data.payments;
    console.log("Response data:", responseData);
    
    if (!responseData || responseData.length === 0) {
      throw new Error("No payment found for the given booking ID");
    }

    return responseData;

  } catch (error) {
    console.error("Error in getPaymentByBookingId:", error);
    throw new Error("Failed to retrieve payment due to an internal error");
  }
};

module.exports = {
  getAllPayments,
  getBookingPayments,
  getPaymentByBookingId
};