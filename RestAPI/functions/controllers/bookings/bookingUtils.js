const { dataConnect } = require("../../config/firebase.js");

const checkBookingExists = async (bookingId) => {
  try {
    const CHECK_BOOKING_EXISTS_QUERY = `
      query GetBookingById($bookingId: String!) @auth(level: USER) {
        booking(key: { id: $bookingId }) {
          id
          status
          createdAt
        }
      }
    `;

    const variables = { bookingId };
    const response = await dataConnect.executeGraphql(CHECK_BOOKING_EXISTS_QUERY, { variables });
    return response.data.booking;
  } catch (error) {
    console.error("Error checking booking existence:", error);
    throw error;
  }
};

module.exports = {
  checkBookingExists,
};
