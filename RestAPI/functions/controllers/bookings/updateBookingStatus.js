const { dataConnect } = require("../../config/firebase.js");

const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId, status, staffId } = req.body;

    // Validate input
    if (!bookingId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Booking ID is required",
      });
    }
    
    if (!status) {

      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Status is required",
      });
    }

    const UPDATE_BOOKING_STATUS_MUTATION = `
      mutation UpdateBookingStatus($bookingId: String!, $status: String!, $staffId: String) @auth(level: USER) {
        booking_update(key: { id: $bookingId }, data: { status: $status, staffId: $staffId, updatedAt_expr: "request.time" }) {
          id
          userId
          staffId
          kitId
          timeSlotId
          collectionMethod
          notes
          totalAmount
          status
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      bookingId,
      status,
      staffId: staffId || null,
    };

    console.log("Executing GraphQL mutation:", UPDATE_BOOKING_STATUS_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(UPDATE_BOOKING_STATUS_MUTATION, {
      variables,
    });

    const booking = response.data?.booking_update;

    if (!booking) {
      throw new Error("Failed to update booking status");
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Booking status updated successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error updating booking status:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to update booking status",
      error: error.message,
    });
  }
};

module.exports = {
  updateBookingStatus,
};