const { dataConnect } = require("../../config/firebase.js");
const {checkTimeSlotExists} = require("./getTimeSlot.js");
const {updateTimeSlot} = require("./updateTimeSlot.js");
const {isSlotAvailable} = require("../timeSlots/getTimeSlot.js");

const addTimeSlot = async (slotDate, startTime, endTime) => {
  try {
    if (!slotDate) {
      throw new Error("slotDate is required");
    }
    if (!startTime) {
      throw new Error("startTime is required");
    }
    if (!endTime) {
      throw new Error("endTime is required");
    }

    const CREATE_TIME_SLOT_MUTATION = `
      mutation CreateTimeSlot($id: String!, $slotDate: Date!, $startTime: String!, $endTime: String!, $maxCapacity: Int!, $notes: String) @auth(level: USER) {
        timeSlot_insert(data: {id: $id, slotDate: $slotDate, startTime: $startTime, endTime: $endTime, maxCapacity: $maxCapacity, notes: $notes, currentBookings: 1, available: true})
      }
    `;

    const variables = {
      id : `${slotDate}_${startTime}_${endTime}`,
      slotDate,
      startTime,
      endTime,
      maxCapacity : 4,
      notes: "",
    };

    const existingTimeSlot = await checkTimeSlotExists(variables.id);
    if (existingTimeSlot != null) {
      console.log("Time slot already exists with ID:", variables.id);

      const isAvailable = await isSlotAvailable(variables.id);
        if (!isAvailable) {
          throw new Error("Time slot is not available");
        }
      console.log("Time slot is available for booking:", variables.id);
      const updateTimeSlotResponse = await updateTimeSlot(variables.id, 'increase');
      return {
        statusCode: 200,
        status: "success",
        message: "Time slot already exists, current bookings increased",
        data: updateTimeSlotResponse,
      };
    }

    console.log("Executing GraphQL mutation:", CREATE_TIME_SLOT_MUTATION, "with variables:", variables);
    const response = await dataConnect.executeGraphql(CREATE_TIME_SLOT_MUTATION, {
      variables: variables,
    });

    const responseData = response.data;
    return {
      statusCode: 201,
      status: "success",
      message: "Time slot created successfully",
      data: responseData,
    };
  } catch (error) {
    console.error("Error creating timeSlot:", error);
    if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
      throw new Error("timeSlot with this ID already exists");
    }

    if (error.codePrefix === 'data-connect' && error.errorInfo) {
      throw new Error("Database operation failed: " + error.message);
    }

    throw error;
  }
};

module.exports = {
  addTimeSlot,
};