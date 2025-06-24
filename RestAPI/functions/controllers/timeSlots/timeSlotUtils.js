const { dataConnect } = require("../../config/firebase.js");
const {countUsersByRole} = require("../users/userUtils.js");

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
          currentBookings
          notes
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

module.exports = {
  checkTimeSlotExists,
  isSlotAvailable,
};
