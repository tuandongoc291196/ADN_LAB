const { dataConnect } = require("../../config/firebase.js");

const assignBookingStaff = async (req, res) => {
  try {
    const { bookingId, staffId } = req.body;

    // Validate input
    if (!bookingId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Booking ID is required",
      });
    }
    
    if (!staffId) {

      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Staff ID is required",
      });
    }

    const ASSIGN_BOOKING_STAFF_MUTATION = `
      mutation AssignBookingStaff($bookingId: String!, $staffId: String!) @auth(level: USER) {
        booking_update(key: { id: $bookingId }, data: { staffId: $staffId, updatedAt_expr: "request.time" }) {
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
      staffId,
    };

    console.log("Executing GraphQL mutation:", ASSIGN_BOOKING_STAFF_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(ASSIGN_BOOKING_STAFF_MUTATION, {
      variables,
    });

    const booking = response.data?.booking_update;

    if (!booking) {
      throw new Error("Failed to assign staff to booking");
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Staff assigned to booking successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error assigning staff to booking:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to assign staff to booking",
      error: error.message,
    });
  }
};

module.exports = {
  assignBookingStaff,
};