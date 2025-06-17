// controllers/timeSlots/createTimeSlot.js
const { dataConnect } = require("../../config/firebase.js");

const createTimeSlot = async (req, res) => {
  try {
    const { id, slotDate, startTime, endTime, maxCapacity, staffId, notes } = req.body;

    // Validate input
    if (!id || !slotDate || !startTime || !endTime || !maxCapacity) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Time Slot ID, slot date, start time, end time, and max capacity are required",
      });
    }

    const CREATE_TIME_SLOT_MUTATION = `
      mutation CreateTimeSlot($id: String!, $slotDate: Date!, $startTime: String!, $endTime: String!, $maxCapacity: Int!, $staffId: String, $notes: String) @auth(level: USER) {
        timeSlot_insert(data: { id: $id, slotDate: $slotDate, startTime: $startTime, endTime: $endTime, maxCapacity: $maxCapacity, staffId: $staffId, notes: $notes, currentBookings: 0, available: true }) {
          id
          slotDate
          startTime
          endTime
          maxCapacity
          currentBookings
          available
          staffId
          notes
        }
      }
    `;

    const variables = {
      id,
      slotDate,
      startTime,
      endTime,
      maxCapacity,
      staffId: staffId || null,
      notes: notes || null,
    };

    console.log("Executing GraphQL mutation:", CREATE_TIME_SLOT_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(CREATE_TIME_SLOT_MUTATION, {
      variables,
    });

    const timeSlot = response.data?.timeSlot_insert;

    if (!timeSlot) {
      throw new Error("Failed to create time slot");
    }

    res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Time slot created successfully",
      data: timeSlot,
    });
  } catch (error) {
    console.error("Error creating time slot:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to create time slot",
      error: error.message,
    });
  }
};

module.exports = {
  createTimeSlot,
};