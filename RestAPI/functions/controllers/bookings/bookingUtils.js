const { dataConnect } = require("../../config/firebase.js");
const { getBookingHistoryByBookingId } = require("../bookingHistory/getBookingHistory.js");

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

const checkUserBookingExists = async (userId, timeSlotId) => {

  if (!userId) {
    throw new Error("User ID is required to check booking existence.");
  }

  if (!timeSlotId) {
    throw new Error("Time Slot ID is required to check booking existence.");
  }

  try {
    const CHECK_USER_BOOKING_EXISTS_QUERY = `
      query GetBookingByUserAndTimeSlot($userId: String!, $timeSlotId: String!) {
        bookings(where: {
          userId: { eq: $userId }
          timeSlotId: { eq: $timeSlotId }
        }, orderBy: {
          createdAt: DESC
        }) {
          id
          userId
          staffId
          timeSlotId
          serviceId
          methodId
          totalAmount
          expiresAt
          createdAt
          updatedAt
          user {
            id
            fullname
            email
          }
          staff {
            id
            user {
              fullname
            }
          }
          timeSlot {
            id
            slotDate
            startTime
            endTime
          }
          service {
            id
            title
            description
            price
          }
          method {
            id
            name
            description
            price
          }
        }
      }
    `;

    const variables = {
      userId: userId,
      timeSlotId: timeSlotId
    };
    const response = await dataConnect.executeGraphql(CHECK_USER_BOOKING_EXISTS_QUERY, { 
      variables: variables 
    });
    const bookings = response.data.bookings;
    console.log("Bookings found:", bookings);
    
    if (bookings.length === 0) {
      return false;
    }
    
    for (const booking of bookings) {
      try {
        const bookingHistory = await getBookingHistoryByBookingId(booking.id);
        if (bookingHistory && bookingHistory.length > 0) {
          const latestStatus = bookingHistory[0].status;
          console.log(`Booking ${booking.id} latest status:`, latestStatus);
          
          if (latestStatus ==  "EXPIRED" || latestStatus == "CANCELLED") {
            return false;
          } else return true;
        } else {
          return true;
        }
      } catch (historyError) {
        console.error(`Error checking history for booking ${booking.id}:`, historyError);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error checking user booking existence:", error);
    throw error;
  }
}

const checkStaffBookingExists = async (staffId, timeSlotId) => {

  if (!staffId) {
    throw new Error("Staff ID is required to check booking existence.");
  }

  if (!timeSlotId) {
    throw new Error("Time Slot ID is required to check booking existence.");
  }

  try {
    const CHECK_STAFF_BOOKING_EXISTS_QUERY = `
      query GetBookingByStaffAndTimeSlot($staffId: String!, $timeSlotId: String!) {
        bookings(where: {
          staffId: { eq: $staffId }
          timeSlotId: { eq: $timeSlotId }
        }, orderBy: {
          createdAt: DESC
        }) {
          id
          userId
          staffId
          timeSlotId
          serviceId
          methodId
          totalAmount
          expiresAt
          createdAt
          updatedAt
          user {
            id
            fullname
            email
          }
          staff {
            id
            user {
              fullname
            }
          }
          timeSlot {
            id
            slotDate
            startTime
            endTime
          }
          service {
            id
            title
            description
            price
          }
          method {
            id
            name
            description
            price
          }
        }
      }
    `;

    const variables = {
      staffId: staffId,
      timeSlotId: timeSlotId
    };
    const response = await dataConnect.executeGraphql(CHECK_STAFF_BOOKING_EXISTS_QUERY, { 
      variables: variables 
    });
    const bookings = response.data.bookings;
    console.log("Staff bookings found:", bookings);
    
    if (bookings.length === 0) {
      return false;
    }
    
    for (const booking of bookings) {
      try {
        const bookingHistory = await getBookingHistoryByBookingId(booking.id);
        if (bookingHistory && bookingHistory.length > 0) {
          const latestStatus = bookingHistory[0].status;
          console.log(`Booking ${booking.id} latest status:`, latestStatus);
          
          if (latestStatus ==  "EXPIRED" || latestStatus == "CANCELLED") {
            return false;
          } else return true;
        } else {
          return true;
        }
      } catch (historyError) {
        console.error(`Error checking history for booking ${booking.id}:`, historyError);
        return true;
      }
    }
    
    return false;
  } catch (error) {
    console.error("Error checking staff booking existence:", error);
    throw error;
  }
}

module.exports = {
  checkBookingExists,
  checkUserBookingExists,
  checkStaffBookingExists,
};
