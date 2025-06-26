const { dataConnect } = require("../../config/firebase.js");
const {countActiveUsersByRole} = require("../users/userUtils.js");

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

const isSlotTimePassed = (startTime, slotDate) => {
  try {
    console.log("Checking if slot time has passed for:", slotDate, startTime);
    if (!startTime) {
      throw new Error("startTime is required");
    }
    if (!slotDate) {
      throw new Error("slotDate is required");
    }

    const currentTime = new Date(new Date().toLocaleString("en-US", {timeZone: "Asia/Bangkok"}));
    const slotDateTime = new Date(`${slotDate}T${startTime}`);
    console.log("Current time:", currentTime);
    console.log("Slot date and time:", slotDateTime);

    if (slotDateTime <= currentTime) {
      console.log(`Time slot ${slotDate} ${startTime} has already passed`);
      throw new Error(`Time slot ${slotDate} ${startTime} has already passed`);
    }

    return false;
  } catch (error) {
    console.error("Error checking if slot time has passed:", error);
    throw error;
  }
};

const isSlotBookingAvailable = async (startTime, endTime, slotDate) => {
  try {
    console.log("Checking slot booking availability for:", slotDate, startTime, endTime);
    if (!startTime) {
      throw new Error("startTime is required");
    }
    if (!endTime) {
      throw new Error("endTime is required");
    }
    if (!slotDate) {
      throw new Error("slotDate is required");
    }

    const timeSlotId = `${slotDate}_${startTime}_${endTime}`;
    const maxBookings = await countActiveUsersByRole("1");
    
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

    const response = await dataConnect.executeGraphql(GET_AVAILABLE_TIME_SLOT, {
      variables: variables,
    });

    const responseData = response.data.timeSlots;
    
    if (!responseData || responseData.length === 0) {
      console.log("Time slot not available or not found:", timeSlotId);
      throw new Error("Time slot is fully booked or does not exist");
    }

    console.log(`Slot ${timeSlotId} is available with ${responseData[0].currentBookings}/${maxBookings} bookings`);
    return true;

  } catch (error) {
    console.error("Error checking slot booking availability:", error);
    throw error;
  }
};


module.exports = {
  checkTimeSlotExists,
  isSlotTimePassed,
  isSlotBookingAvailable,
};
