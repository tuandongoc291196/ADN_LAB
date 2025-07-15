const { updateStaffSlotCount } = require("../users/updateUser.js");
const { updateTimeSlot } = require("../timeSlots/updateTimeSlot.js");
const { addBookingHistory } = require("../bookingHistory/addBookingHistory.js");
const { getBookingHistoryByBookingId } = require("../bookingHistory/getBookingHistory.js");
const { getExpiredBookings } = require("../bookings/getBookings.js");

const cleanupExpiredBookings = async () => {
  try {
    const currentTime = new Date().toISOString();
    const expiredBookings = await getExpiredBookings(currentTime);
    for (const booking of expiredBookings) {
      try {
        const latestHistory = await getBookingHistoryByBookingId(booking.id);
        
        console.log(`Processing booking ${booking.id} with latest history:`, latestHistory);
        console.log(`Status of latest history:`, latestHistory[0]?.status);
        if (latestHistory[0]?.status === "PENDING" || latestHistory[0]?.status === "CREATED") {
          console.log(`Marking expired booking as cancelled: ${booking.id}`);
          await updateStaffSlotCount(booking.staffId, "decrease");
          await updateTimeSlot(booking.timeSlotId, "decrease");
          await addBookingHistory(booking.id, "EXPIRED", "Booking expired due to payment timeout - automatically cancelled");
          console.log(`Successfully marked booking as expired: ${booking.id}`);
        } else {
          console.log(`Booking ${booking.id} has status ${latestHistory[0]?.status}, skipping cleanup`);
        }
      } catch (bookingError) {
        console.error(`Error processing booking ${booking.id}:`, bookingError);
      }
    }
  } catch (error) {
    console.error("Error in cleanup process:", error);
  }
};

module.exports = {
  cleanupExpiredBookings
};