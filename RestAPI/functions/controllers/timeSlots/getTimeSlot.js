const { dataConnect } = require("../../config/firebase.js");
const {countUsersByRole} = require("../users/getUsers.js")

const getUnavailableTimeSlots = async (req, res) => {
  try {
    const {slotDate} = req.body;

    if (!slotDate) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "slotDate is required",
      });
    }
    const maxBookings = await countUsersByRole("1");
    const GET_UNAVAILABLE_TIME_SLOTS = `
      query GetUnAvailableTimeSlots($slotDate: Date!, $maxBookings: Int!) @auth(level: USER) {
        timeSlots(where: {slotDate: {eq: $slotDate}, currentBookings: {ge: $maxBookings}}, orderBy: {startTime: ASC}) {
          id
          slotDate
          startTime
          endTime
          maxCapacity
          currentBookings
          notes
        }
      }
    `;
    
    const variables = {
      slotDate,
      maxBookings,
    };

    console.log("Executing GraphQL mutation:", GET_UNAVAILABLE_TIME_SLOTS, "with variables:", variables);
    const response = await dataConnect.executeGraphql(GET_UNAVAILABLE_TIME_SLOTS, {
      variables: variables,
    });

    const responseData = response.data;
    if (!responseData || responseData.timeSlots.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "No unavailable time slots found for the specified date - " + slotDate,
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Unavailable time slots retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error retrieving unavailable time slots:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve unavailable time slots",
      error: error.message,
    });
  }
}

const checkTimeSlotExists = async (timeSlotId) => {
  try {

    if (!timeSlotId) {
      throw new Error("timeSlotId is required");
    }

    const GET_TIME_SLOT_BY_ID = `
      query GetTimeSlotById($timeSlotId: String!) @auth(level: USER) {
        timeSlot(key: { id: $timeSlotId }) {
          id
          slotDate
          startTime
          endTime
          maxCapacity
          currentBookings
          notes
          available
        }
      }
    `;

    const variables = {timeSlotId};

    console.log("Executing GraphQL query:", GET_TIME_SLOT_BY_ID, "with variables:", variables);
    const response = await dataConnect.executeGraphql(GET_TIME_SLOT_BY_ID, {
      variables: variables,
    });

    const responseData = response.data.timeSlot;
    return responseData;
  } catch (error) {
    console.error("Error checking if timeslot exists:", error);
    throw error;
  }
}

const isSlotAvailable = async (timeSlotId) => {
  try {
    if (!timeSlotId) {
      throw new Error("timeSlotId is required");
    }
    const maxBookings = await countUsersByRole("1");
    
    const GET_AVAILABLE_TIME_SLOT = `
      query GetAvailableTimeSlot($timeSlotId: String!, $maxBookings: Int!) @auth(level: USER) {
        timeSlots(where: { 
          id: { eq: $timeSlotId }, 
          currentBookings: { lt: $maxBookings } 
        }) {
          id
          available
          maxCapacity
          currentBookings
        }
      }
    `;

    const variables = { timeSlotId, maxBookings };

    console.log("Checking slot availability for:", timeSlotId);
    const response = await dataConnect.executeGraphql(GET_AVAILABLE_TIME_SLOT, {
      variables: variables,
    });

    const responseData = response.data.timeSlots;
    
    if (!responseData || responseData.length === 0) {
      console.log("Time slot not available or not found:", timeSlotId);
      return false;
    }

    console.log(`Slot ${timeSlotId} is available with ${responseData[0].currentBookings}/${maxBookings} bookings`);
    return true;

  } catch (error) {
    console.error("Error checking slot availability:", error);
    return false;
  }
};

const getOneTimeSlot = async (req, res) => {
  try {
    const {timeSlotId} = req.body;

    if (!timeSlotId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "timeSlotId is required",
      });
    }

    const existingTimeSlot = await checkTimeSlotExists(timeSlotId);
    if (!existingTimeSlot) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Time slot not found with id: " + timeSlotId,
      });
    }
    
    const GET_TIME_SLOT_BY_ID = `
      query GetTimeSlotById($timeSlotId: String!) @auth(level: USER) {
        timeSlot(key: { id: $timeSlotId }) {
          id
          slotDate
          startTime
          endTime
          maxCapacity
          currentBookings
          notes
          available
        }
      }
    `;

    const variables = {timeSlotId};

    console.log("Executing GraphQL query:", GET_TIME_SLOT_BY_ID, "with variables:", variables);
    const response = await dataConnect.executeGraphql(GET_TIME_SLOT_BY_ID, {
      variables: variables,
    });

    const responseData = response.data;

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Time slot retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error retrieving time slot:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve time slot",
      error: error.message,
    });
  }
};

module.exports = {
  getUnavailableTimeSlots,
  checkTimeSlotExists,
  isSlotAvailable,
  getOneTimeSlot
};