const { dataConnect } = require("../../config/firebase.js");

const updateTimeSlot = async (timeSlotId, operation) => {
  try {
    if (!timeSlotId) {
      throw new Error("Time slot ID is required");
    }

    if (!operation || (operation !== 'increase' && operation !== 'decrease')) {
      throw new Error("Operation must be 'increase' or 'decrease'");
    }

    const GET_TIME_SLOT_QUERY = `
      query GetTimeSlot($id: String!) @auth(level: USER) {
        timeSlot(key: { id: $id }) {
          id
          currentBookings
        }
      }
    `;

    const getResponse = await dataConnect.executeGraphql(GET_TIME_SLOT_QUERY, {
      variables: { id: timeSlotId },
    });

    if (!getResponse.data?.timeSlot) {
      throw new Error("Time slot not found");
    }

    const currentBookings = getResponse.data.timeSlot.currentBookings;
    console.log("Current bookings for time slot:", currentBookings);
    const isIncrease = operation === 'increase';
    const newBookings = isIncrease ? currentBookings + 1 : Math.max(0, currentBookings - 1);

    const UPDATE_CURRENT_BOOKINGS_MUTATION = `
      mutation UpdateCurrentBookings($id: String!, $currentBookings: Int!) @auth(level: USER) {
        timeSlot_update(id: $id, data: {currentBookings: $currentBookings})
      }
    `;

    const variables = {
      id: timeSlotId,
      currentBookings: newBookings,
    };

    console.log("Executing GraphQL mutation:", UPDATE_CURRENT_BOOKINGS_MUTATION, "with variables:", variables);
    const response = await dataConnect.executeGraphql(UPDATE_CURRENT_BOOKINGS_MUTATION, {
      variables: variables,
    });

    return {
      success: true,
      data: response.data,
      message: `Current bookings ${operation}d successfully`,
      previousBookings: currentBookings,
      newBookings: newBookings
    };
  } catch (error) {
    console.error(`Error ${operation}ing current bookings:`, error);
    throw error;
  }
};

module.exports = {
  updateTimeSlot,
};

