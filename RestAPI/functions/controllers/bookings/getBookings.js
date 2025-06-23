const { dataConnect } = require("../../config/firebase.js");
const { checkBookingExists } = require("./bookingUtils.js");

// Get all bookings for the current user
const getAllBookings = async (req, res) => {
  try {
    const GET_MY_BOOKINGS_QUERY = `
      query GetMyBookings @auth(level: USER) {
        bookings(orderBy: { createdAt: DESC }) {
          id
          status
          collectionMethod
          totalAmount
          price
          quantity
          notes
          service {
            id
            title
            description
            category
            serviceType
            duration
          }
          timeSlot {
            slotDate
            startTime
            endTime
          }
          staff {
            fullname
          }
          createdAt
          updatedAt
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
          user {
            id
            fullname
            email
            phone
            shippingAddress
          }
          staff {
            id
            fullname
          }
          service {
            id
            title
            description
            fullDescription
            price
            duration
            category
            serviceType
            hasLegalValue
            participants
            requiredDocuments
            procedures
          }
          timeSlot {
            slotDate
            startTime
            endTime
          }
          status
          collectionMethod
          price
          quantity
          notes
          totalAmount
          createdAt
          updatedAt
        }
      }
    `;
    
    const response = await dataConnect.executeGraphql(GET_BOOKING_BY_ID_QUERY, {
      variables: variables,
    });

    const responseData = response.data;

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

module.exports = {
  getAllBookings,
  getOneBooking,
};