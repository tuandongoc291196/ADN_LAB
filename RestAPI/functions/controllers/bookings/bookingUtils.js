const { dataConnect } = require("../../config/firebase.js");

const checkBookingExists = async (bookingId) => {
  try {
    const CHECK_BOOKING_EXISTS_QUERY = `
      query GetBookingById($bookingId: String!) @auth(level: USER) {
        booking(key: { id: $bookingId }) {
          id
          userId
          user {
            id
          }
          staffId
          staff {
            id
          }
          timeSlotId
          timeSlot {
            id
          }
          serviceId
          service {
            id
          }
          methodId
          method {
            id
          }
          totalAmount
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      bookingId: bookingId 
    };
    const response = await dataConnect.executeGraphql(CHECK_BOOKING_EXISTS_QUERY, { 
      variables: variables 
    });
    const responseData = response.data.booking;
    if (!responseData) {
      console.log(`Booking with ID ${bookingId} does not exist`);
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error checking booking existence:", error);
    throw error;
  }
};

module.exports = {
  checkBookingExists,
};
