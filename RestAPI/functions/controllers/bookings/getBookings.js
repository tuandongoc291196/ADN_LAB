const { dataConnect } = require("../../config/firebase.js");
const { checkBookingExists } = require("./bookingUtils.js");
const {checkUserExists} = require("../users/userUtils.js");
const {checkStaffExists} = require("../users/userUtils.js");
const {checkTimeSlotExists} = require("../timeSlots/timeSlotUtils.js");

const getAllBookings = async (req, res) => {
  try {
    const GET_MY_BOOKINGS_QUERY = `
      query GetMyBookings @auth(level: USER) {
        bookings(orderBy: { createdAt: DESC }) {
          id
          userId
          staffId
          timeSlotId
          serviceId
          methodId
          totalAmount
          createdAt
          updatedAt
          service {
            id
          }
          timeSlot {
            id
          }
          staff {
            id
          }
          method {
            id
          }
        }
      }
    `;

    const response = await dataConnect.executeGraphql(GET_MY_BOOKINGS_QUERY);

    const responseData = response.data;

    if (!responseData.bookings || responseData.bookings.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "There is no booking in the database",
      });
    }
    
    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Bookings retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve bookings",
      error: error.message,
    });
  }
};


const getOneBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;
    
    if (!bookingId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "bookingId is required",
      });
    }

    const existingBooking = await checkBookingExists(bookingId);
    
    if (!existingBooking) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Booking not found",
        error: "Booking with the provided ID does not exist",
      });
    }
    
    const variables = {
      bookingId: bookingId,
    };
    
    const GET_BOOKING_BY_ID_QUERY = `
      query GetBookingById($bookingId: String!) @auth(level: USER) {
        booking(key: { id: $bookingId }) {
          id
          userId
          staffId
          timeSlotId
          serviceId
          methodId
          totalAmount
          createdAt
          updatedAt
          participants_on_booking {
            id
            name
            age
            identification
            gender
            relationship
            createdAt
            updatedAt
          }
          bookingHistories_on_booking (orderBy: {createdAt: DESC}) {
            id
            description
            status
            createdAt
            updatedAt
          }
          informations_on_booking {
            id
            name
            identification
            address
            phone
            email
            createdAt
            updatedAt
          }
          user {
            id
            fullname
            email
            phone
          }
          staff {
            id
            user {
              fullname
            }
          }
          service {
            id
            title
            description
            fullDescription
            price
            duration
            category {
              id
              name
              description
              hasLegalValue
            }
          }
          timeSlot {
            id
          }
          method {
            id
            name
          }
        }
      }
    `;
    
    const response = await dataConnect.executeGraphql(GET_BOOKING_BY_ID_QUERY, {
      variables: variables,
    });

    const responseData = response.data.booking;

    if (!responseData) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Booking not found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Booking retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve booking",
      error: error.message,
    });
  }
};

const getBookingByUserId = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "userId is required",
      });
    }

    if (!await checkUserExists(userId)) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "User not found",
        error: "User with the provided ID does not exist",
      });
    }

    const GET_BOOKINGS_BY_USER_QUERY = `
      query GetBookingsByUser($userId: String!) @auth(level: USER) {
        bookings(where: { userId: { eq: $userId } }, orderBy: { createdAt: DESC }) {
          id
          userId
          staffId
          timeSlotId
          serviceId
          methodId
          totalAmount
          createdAt
          updatedAt
          participants_on_booking {
            name
            age
            gender
            identification          
            relationship
          }
          service {
            id
            title
            description
            fullDescription
            price
            duration
            category {
              id
              name
              description
              hasLegalValue
            }
          }
          timeSlot {
            id
          }
          staff {
            id
            user {
              fullname
            }
          }
          method {
            id
            name
          }
          payments_on_booking {
            id
            status
            createdAt
          }
        }
      }
    `;

    const variables = { 
      userId: userId 
    };
    const response = await dataConnect.executeGraphql(GET_BOOKINGS_BY_USER_QUERY, { 
      variables: variables 
    });

    const responseData = response.data.bookings;

    if (!responseData || responseData.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "No bookings found for the given user ID",
      });
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Bookings retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching bookings by user ID:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve bookings by user ID",
      error: error.message,
    });
  }
}

const getBookingbyStaffId = async (req, res) => {
  try {
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "staffId is required",
      });
    }

    if (!await checkStaffExists(staffId, "1")) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Staff not found",
        error: "Staff with the provided ID does not exist",
      });
    }

    const GET_BOOKINGS_BY_STAFF_QUERY = `
      query GetBookingsByStaff($staffId: String!) @auth(level: USER) {
        bookings(where: { staffId: { eq: $staffId } }, orderBy: { createdAt: DESC }) {
          id
          userId
          staffId
          timeSlotId
          serviceId
          methodId
          totalAmount
          createdAt
          updatedAt
          service {
            id
          }
          timeSlot {
            id
          }
          staff {
            id
          }
          method {
            id
          }
        }
      }
    `;

    const variables = { 
      staffId: staffId 
    };
    const response = await dataConnect.executeGraphql(GET_BOOKINGS_BY_STAFF_QUERY, { 
      variables: variables 
    });

    const responseData = response.data.bookings;

    if (!responseData || responseData.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "No bookings found for the given staff ID",
      });
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Bookings retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching bookings by staff ID:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve bookings by staff ID",
      error: error.message,
    });
  }
}

const getBookingByTimeSlotId = async (req, res) => {
  try {
    const { timeSlotId } = req.body;

    if (!timeSlotId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "timeSlotId is required",
      });
    }

    if (!await checkTimeSlotExists(timeSlotId)) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Time slot not found",
        error: "Time slot with the provided ID does not exist",
      });
    }

    const GET_BOOKINGS_BY_TIME_SLOT_QUERY = `
      query GetBookingsByTimeSlot($timeSlotId: String!) @auth(level: USER) {
        bookings(where: { timeSlotId: { eq: $timeSlotId } }, orderBy: { createdAt: DESC }) {
          id
          userId
          staffId
          timeSlotId
          serviceId
          methodId
          totalAmount
          createdAt
          updatedAt
          service {
            id
          }
          timeSlot {
            id
          }
          staff {
            id
          }
          method {
            id
          }
        }
      }
    `;

    const variables = { 
      timeSlotId: timeSlotId 
    };
    const response = await dataConnect.executeGraphql(GET_BOOKINGS_BY_TIME_SLOT_QUERY, { 
      variables: variables 
    });

    const responseData = response.data.bookings;

    if (!responseData || responseData.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "No bookings found for the given time slot ID",
      });
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Bookings retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching bookings by time slot ID:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve bookings by time slot ID",
      error: error.message,
    });
  }
}

const getOneBookingById = async (bookingId) => {
  try {
    if (!bookingId) {
      throw new Error("bookingId is required");
    }
    const existingBooking = await checkBookingExists(bookingId);
    if (!existingBooking) {
      throw new Error("Booking not found");
    }
    const variables = {
      bookingId: bookingId,
    };
    const GET_BOOKING_BY_ID_QUERY = `
      query GetBookingById($bookingId: String!) @auth(level: USER) {
        booking(key: { id: $bookingId }) {
          id
          userId
          staffId
          timeSlotId
          serviceId
          methodId
          totalAmount
          createdAt
          updatedAt
          participants_on_booking {
            id
            name
            age
            identification
            gender
            relationship
            createdAt
            updatedAt
          }
          bookingHistories_on_booking (orderBy: {createdAt: DESC}) {
            id
            description
            status
            createdAt
            updatedAt
          }
          informations_on_booking {
            id
            name
            identification
            address
            phone
            email
            createdAt
            updatedAt
          }
          user {
            id
            fullname
            email
            phone
          }
          staff {
            id
            user {
              fullname
            }
          }
          service {
            id
            title
            description
            fullDescription
            price
            duration
            category {
              id
              name
              description
              hasLegalValue
            }
          }
          timeSlot {
            id
          }
          method {
            id
            name
          }
          payments_on_booking {
            id
            status
            createdAt
          }
        }
      }
    `;

    const response = await dataConnect.executeGraphql(GET_BOOKING_BY_ID_QUERY, {
      variables: variables,
    });
    
    const responseData = response.data.booking;
    if (!responseData) {
      throw new Error("Booking not found");
    }
    return responseData;
  } catch (error) {
    console.error("Error fetching booking by ID:", error);
    throw new Error(`Failed to retrieve booking: ${error.message}`);
  }
};

const getBookingsBySlotDate = async (slotDate) => {
  try {
    if (!slotDate) {
      throw new Error("slotDate is required");
    }

    const GET_BOOKINGS_BY_SLOT_DATE_QUERY = `
      query GetBookingsBySlotDate($slotDate: Date!) @auth(level: USER) {
        bookings(where: {timeSlot: {slotDate: {eq: $slotDate}}}) {
          id
          staffId
          timeSlotId
          user {
            id
            fullname
            email
            phone
            address
          }
          staff {
            id
            user {
              fullname
            }
          }
          service {
            id
            title
            description
            fullDescription
            price
            duration
            category {
              id
              name
              description
              hasLegalValue
            }
          }
          method {
            id
            name
            description
            price
          }
          timeSlot {
            slotDate
            startTime
            endTime
          }
          totalAmount
          createdAt
        }
      }
    `;

    const variables = {
      slotDate: slotDate
    };

    console.log("Fetching bookings for slot date:", slotDate);
    const response = await dataConnect.executeGraphql(GET_BOOKINGS_BY_SLOT_DATE_QUERY, {
      variables: variables
    });

    const responseData = response.data.bookings;
    if (!responseData || responseData.length === 0) {
      console.log("No bookings found for slot date:", slotDate);
      return [];
    } else {
      return responseData;
    }
  } catch (error) {
    throw new Error(`Failed to fetch bookings by slot date: ${error.message}`);
  }
};

const getExpiredBookings = async (currentTime) => {
  try {
    if (!currentTime) {
      throw new Error("currentTime is required");
    }

    const GET_EXPIRED_BOOKINGS_QUERY = `
      query GetExpiredBookings($currentTime: Timestamp!) @auth(level: USER) {
        bookings(where: {expiresAt: {lt: $currentTime}}) {
          id
          staffId
          timeSlotId
        }
      }
    `;

    const variables = {
      currentTime: currentTime
    };

    console.log("Fetching expired bookings for time:", currentTime);
    const response = await dataConnect.executeGraphql(GET_EXPIRED_BOOKINGS_QUERY, {
      variables: variables
    });

    const responseData = response.data.bookings;
    if (!responseData || responseData.length === 0) {
      console.log("No expired bookings found");
      return [];
    } else {
      return responseData;
    }
  } catch (error) {
    throw new Error(`Failed to fetch expired bookings: ${error.message}`);
  }
};

module.exports = {
  getAllBookings,
  getOneBooking,
  getBookingByUserId,
  getBookingbyStaffId,
  getBookingByTimeSlotId,
  getOneBookingById,
  getBookingsBySlotDate,
  getExpiredBookings
};