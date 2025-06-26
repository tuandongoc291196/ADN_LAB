const { dataConnect } = require("../../config/firebase.js");
const { updateStaffSlotCount } = require("../users/updateUser.js");
const { addBookingHistory } = require("../bookingHistory/addBookingHistory.js");

const GET_EXPIRED_BOOKINGS_QUERY = `
  query GetExpiredBookings($currentTime: Timestamp!) @auth(level: USER) {
    bookings(where: {expiresAt: {lt: $currentTime}}) {
      id
      staffId
      timeSlotId
    }
  }
`;

const GET_LATEST_BOOKING_HISTORY_QUERY = `
  query GetLatestBookingHistory($bookingId: String!) @auth(level: USER) {
    bookingHistories(where: {bookingId: {eq: $bookingId}}, orderBy: {createdAt: DESC}, limit: 1) {
      status
    }
  }
`;

const cleanupExpiredBookings = async () => {
  try {
    const currentTime = new Date().toISOString();
    const expiredBookingsResponse = await dataConnect.executeGraphql(GET_EXPIRED_BOOKINGS_QUERY, {
      variables: { currentTime }
    });
    const expiredBookings = expiredBookingsResponse.data?.bookings || [];
    for (const booking of expiredBookings) {
      try {
        const historyResponse = await dataConnect.executeGraphql(GET_LATEST_BOOKING_HISTORY_QUERY, {
          variables: { bookingId: booking.id }
        });
        const latestHistory = historyResponse.data.bookingHistories;
        console.log(`Processing booking ${booking.id} with latest history:`, latestHistory);
        if (!latestHistory || latestHistory.status !== "booked") {
          console.log(`Marking expired booking as cancelled: ${booking.id}`);
          await updateStaffSlotCount(booking.staffId, "decrease");
          await addBookingHistory(booking.id, "expired", "Booking expired due to payment timeout - automatically cancelled");
          console.log(`Successfully marked booking as expired: ${booking.id}`);
        } else if (latestHistory.status === "booked") {
          console.log(`Booking ${booking.id} has completed payment, skipping cleanup`);
        } else if (latestHistory[0].status === "expired") {
          console.log(`Booking ${booking.id} already marked as expired, skipping`);
        } else {
          console.log(`Booking ${booking.id} has status ${latestHistory[0].status}, skipping cleanup`);
        }
      } catch (bookingError) {
        console.error(`Error processing booking ${booking.id}:`, bookingError);
      }
    }
    console.log(`Cleanup completed. Processed ${expiredBookings.length} expired bookings.`);
  } catch (error) {
    console.error("Error in cleanup process:", error);
  }
};

module.exports = {
  cleanupExpiredBookings
};