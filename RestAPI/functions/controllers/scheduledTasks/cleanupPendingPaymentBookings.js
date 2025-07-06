const { updateStaffSlotCount } = require("../users/updateUser.js");
const { updateTimeSlot } = require("../timeSlots/updateTimeSlot.js");
const { addBookingHistory } = require("../bookingHistory/addBookingHistory.js");
const { getBookingHistoryByBookingId } = require("../bookingHistory/getBookingHistory.js");
const { getBookingsBySlotDate } = require("../bookings/getBookings.js");
const {deletePaymentByBookingId} = require("../payments/deletePayment.js");

const cleanupPendingPaymentBookings = async () => {
  try {
    const currentDate = new Date();
    const gmt7Date = new Date(currentDate.getTime() + (7 * 60 * 60 * 1000));
    const todayDate = gmt7Date.toISOString().split('T')[0];
    
    console.log(`Checking pending payment bookings for date: ${todayDate}`);
    const todayBookings = await getBookingsBySlotDate(todayDate);
    
    console.log(`Found ${todayBookings.length} bookings for today`);
    
    for (const booking of todayBookings) {
      try {
        const latestHistory = await getBookingHistoryByBookingId(booking.id);
        
        console.log(`Processing booking ${booking.id} with latest history:`, latestHistory);
        console.log(`Status of latest history:`, latestHistory[0]?.status);
        
        if (latestHistory[0]?.status === "PENDING_PAYMENT") {
          console.log(`Marking pending payment booking as cancelled: ${booking.id}`);
          await updateStaffSlotCount(booking.staffId, "decrease");
          await updateTimeSlot(booking.timeSlotId, "decrease");
          await deletePaymentByBookingId(booking.id);
          await addBookingHistory(booking.id, "EXPIRED", "Booking expired due to pending payment - automatically cancelled at end of day");
          console.log(`Successfully marked booking as expired: ${booking.id}`);
        } else {
          console.log(`Booking ${booking.id} has status ${latestHistory[0]?.status}, skipping cleanup`);
        }
      } catch (bookingError) {
        console.error(`Error processing booking ${booking.id}:`, bookingError);
      }
    }
  } catch (error) {
    console.error("Error in pending payment cleanup process:", error);
  }
};

module.exports = {
  cleanupPendingPaymentBookings
};
