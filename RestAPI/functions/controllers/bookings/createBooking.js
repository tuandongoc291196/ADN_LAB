const { dataConnect } = require("../../config/firebase.js");

/**
 * Controller để tạo booking mới
 * @param {Object} req - Request object
 * @param {Object} res - Response object
 */
const createBooking = async (req, res) => {
  try {
    const { 
      id,
      userId,
      serviceId,
      timeSlotId,
      appointmentDate,
      appointmentTime,
      status,
      paymentStatus,
      notes,
      address
    } = req.body;

    // Validate input
    if (!userId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "User ID is required",
      });
    }
    
    if (!serviceId) {

      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Service ID is required",
      });
    }

    if (!appointmentDate) {

      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Appointment date is required",
      });
    }

    if (!appointmentTime) {

      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Appointment time is required",
      });
    }

    const CREATE_BOOKING_MUTATION = `
      mutation CreateBooking(
        $id: String!,
        $userId: String!,
        $serviceId: String!,
        $timeSlotId: String,
        $appointmentDate: Date!,
        $appointmentTime: String!,
        $status: String!,
        $paymentStatus: String!,
        $notes: String,
        $address: String
      ) @auth(level: USER) {
        booking_insert(data: {
          id: $id,
          userId: $userId,
          serviceId: $serviceId,
          timeSlotId: $timeSlotId,
          appointmentDate: $appointmentDate,
          appointmentTime: $appointmentTime,
          status: $status,
          paymentStatus: $paymentStatus,
          notes: $notes,
          address: $address,
          createdAt_expr: "request.time"
        }) {
          id
          userId
          serviceId
          timeSlotId
          appointmentDate
          appointmentTime
          status
          paymentStatus
          notes
          address
          createdAt
        }
      }
    `;

    const variables = {
      id: id || `booking-${Date.now()}`,
      userId,
      serviceId,
      timeSlotId: timeSlotId || null,
      appointmentDate,
      appointmentTime,
      status: status || "pending",
      paymentStatus: paymentStatus || "pending",
      notes: notes || null,
      address: address || null
    };

    console.log("Executing GraphQL mutation:", CREATE_BOOKING_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(CREATE_BOOKING_MUTATION, {
      variables,
    });

    const booking = response.data?.booking_insert;

    if (!booking) {
      throw new Error("Failed to create booking");
    }

    // Nếu có timeSlotId, cập nhật số lượng booking trong time slot
    if (timeSlotId) {
      const UPDATE_TIME_SLOT_BOOKINGS_MUTATION = `
        mutation UpdateTimeSlotBookings($timeSlotId: String!) @auth(level: USER) {
          timeSlot_update(key: { id: $timeSlotId }, data: { currentBookings_expr: "currentBookings + 1", updatedAt_expr: "request.time" }) {
            id
            currentBookings
          }
        }
      `;

      await dataConnect.executeGraphql(UPDATE_TIME_SLOT_BOOKINGS_MUTATION, {
        variables: { timeSlotId },
      });
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Booking created successfully",
      data: booking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to create booking",
      error: error.message,
    });
  }
};

module.exports = {
  createBooking,
}; 