const { dataConnect } = require("../../config/firebase.js");

class GetBooking {
  async getStaffBookings(req, res) {
    try {
      const { staffId } = req.params;

      if (!staffId) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Staff ID is required",
        });
      }

      const GET_STAFF_BOOKINGS_QUERY = `
        query GetStaffBookings($staffId: String!) @auth(level: USER) {
          bookings(where: { staffId: { eq: $staffId } }, orderBy: { createdAt: DESC }) {
            id
            user {
              fullname
              email
              phone
            }
            status
            collectionMethod
            totalAmount
            timeSlot {
              slotDate
              startTime
              endTime
            }
            notes
            createdAt
          }
        }
      `;

      const variables = { staffId };

      console.log("Executing GraphQL query:", GET_STAFF_BOOKINGS_QUERY, "with variables:", variables);

      const response = await dataConnect.executeGraphql(GET_STAFF_BOOKINGS_QUERY, { variables });

      const bookings = response.data?.bookings || [];

      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Staff bookings retrieved successfully",
        data: bookings,
      });
    } catch (error) {
      console.error("Error retrieving staff bookings:", error);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Failed to retrieve staff bookings",
        error: error.message,
      });
    }
  }

  async getBookingsByStatus(req, res) {
    try {
      const { status } = req.params;

      if (!status) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Status is required",
        });
      }

      const GET_BOOKINGS_BY_STATUS_QUERY = `
        query GetBookingsByStatus($status: String!) @auth(level: USER) {
          bookings(where: { status: { eq: $status } }, orderBy: { createdAt: DESC }) {
            id
            user {
              fullname
              email
            }
            status
            collectionMethod
            totalAmount
            timeSlot {
              slotDate
              startTime
            }
            staff {
              fullname
            }
            createdAt
          }
        }
      `;

      const variables = { status };

      console.log("Executing GraphQL query:", GET_BOOKINGS_BY_STATUS_QUERY, "with variables:", variables);

      const response = await dataConnect.executeGraphql(GET_BOOKINGS_BY_STATUS_QUERY, { variables });

      const bookings = response.data?.bookings || [];

      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Bookings by status retrieved successfully",
        data: bookings,
      });
    } catch (error) {
      console.error("Error retrieving bookings by status:", error);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Failed to retrieve bookings by status",
        error: error.message,
      });
    }
  }

  async getBookingById(req, res) {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Booking ID is required",
        });
      }

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
            kit {
              id
              status
              amount
            }
            timeSlot {
              slotDate
              startTime
              endTime
              staff {
                fullname
              }
            }
            status
            collectionMethod
            notes
            totalAmount
            createdAt
            updatedAt
          }
        }
      `;

      const variables = { bookingId };

      console.log("Executing GraphQL query:", GET_BOOKING_BY_ID_QUERY, "with variables:", variables);

      const response = await dataConnect.executeGraphql(GET_BOOKING_BY_ID_QUERY, { variables });

      const booking = response.data?.booking;

      if (!booking) {
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
        data: booking,
      });
    } catch (error) {
      console.error("Error retrieving booking by ID:", error);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Failed to retrieve booking",
        error: error.message,
      });
    }
  }

  async getMyBookings(req, res) {
    try {
      const GET_MY_BOOKINGS_QUERY = `
        query GetMyBookings @auth(level: USER) {
          bookings(where: { userId: { eq_expr: "auth.uid" } }, orderBy: { createdAt: DESC }) {
            id
            status
            collectionMethod
            totalAmount
            notes
            timeSlot {
              slotDate
              startTime
              endTime
            }
            staff {
              fullname
            }
            kit {
              id
              status
            }
            createdAt
            updatedAt
          }
        }
      `;

      console.log("Executing GraphQL query:", GET_MY_BOOKINGS_QUERY);

      const response = await dataConnect.executeGraphql(GET_MY_BOOKINGS_QUERY, { variables: {} });

      const bookings = response.data?.bookings || [];

      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "My bookings retrieved successfully",
        data: bookings,
      });
    } catch (error) {
      console.error("Error retrieving my bookings:", error);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Failed to retrieve my bookings",
        error: error.message,
      });
    }
  }

  async getUserBookings(req, res) {
    try {
      const { userId } = req.params;

      if (!userId) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "User ID is required",
        });
      }

      const GET_USER_BOOKINGS_QUERY = `
        query GetUserBookings($userId: String!) @auth(level: USER) {
          bookings(where: { userId: { eq: $userId } }, orderBy: { createdAt: DESC }) {
            id
            status
            collectionMethod
            totalAmount
            timeSlot {
              slotDate
              startTime
              endTime
            }
            staff {
              fullname
            }
            kit {
              id
              status
            }
            createdAt
            updatedAt
          }
        }
      `;

      const variables = { userId };

      console.log("Executing GraphQL query:", GET_USER_BOOKINGS_QUERY, "with variables:", variables);

      const response = await dataConnect.executeGraphql(GET_USER_BOOKINGS_QUERY, { variables });

      const bookings = response.data?.bookings || [];

      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "User bookings retrieved successfully",
        data: bookings,
      });
    } catch (error) {
      console.error("Error retrieving user bookings:", error);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Failed to retrieve user bookings",
        error: error.message,
      });
    }
  }
}

module.exports = GetBooking;