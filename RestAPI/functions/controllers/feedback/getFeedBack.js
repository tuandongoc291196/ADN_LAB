const { dataConnect } = require("../../config/firebase.js");

const getFeedbackByRating = async (req, res) => {
    try {
      const { rating } = req.query;

      if (!rating || isNaN(parseInt(rating))) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Valid rating is required",
        });
      }

      const GET_FEEDBACK_BY_RATING_QUERY = `
        query GetFeedbackByRating($rating: Int!) @auth(level: USER) {
          feedbacks(where: { rating: { eq: $rating } }, orderBy: { createdAt: DESC }) {
            id
            booking {
              user {
                fullname
              }
            }
            rating
            comment
            createdAt
          }
        }
      `;

      const variables = { rating: parseInt(rating) };

      console.log("Executing GraphQL query:", GET_FEEDBACK_BY_RATING_QUERY, "with variables:", variables);

      const response = await dataConnect.executeGraphql(GET_FEEDBACK_BY_RATING_QUERY, { variables });

      const feedbacks = response.data?.feedbacks || [];

      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Feedback by rating retrieved successfully",
        data: feedbacks,
      });
    } catch (error) {
      console.error("Error retrieving feedback by rating:", error);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Failed to retrieve feedback by rating",
        error: error.message,
      });
    }
  }

  const getAllFeedback = async (req, res) => {
    try {
      const { limit, offset } = req.query;

      const GET_ALL_FEEDBACK_QUERY = `
        query GetAllFeedback($limit: Int, $offset: Int) @auth(level: USER) {
          feedbacks(limit: $limit, offset: $offset, orderBy: { createdAt: DESC }) {
            id
            booking {
              user {
                fullname
              }
            }
            rating
            comment
            createdAt
          }
        }
      `;

      const variables = {
        limit: limit ? parseInt(limit) : null,
        offset: offset ? parseInt(offset) : null,
      };

      console.log("Executing GraphQL query:", GET_ALL_FEEDBACK_QUERY, "with variables:", variables);

      const response = await dataConnect.executeGraphql(GET_ALL_FEEDBACK_QUERY, { variables });

      const feedbacks = response.data?.feedbacks || [];

      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "All feedback retrieved successfully",
        data: feedbacks,
      });
    } catch (error) {
      console.error("Error retrieving all feedback:", error);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Failed to retrieve all feedback",
        error: error.message,
      });
    }
  }

  const getBookingFeedback = async (req, res) => {
    try {
      const { bookingId } = req.params;

      if (!bookingId) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Booking ID is required",
        });
      }

      const GET_BOOKING_FEEDBACK_QUERY = `
        query GetBookingFeedback($bookingId: String!) @auth(level: USER) {
          feedbacks(where: { bookingId: { eq: $bookingId } }) {
            id
            rating
            comment
            createdAt
          }
        }
      `;

      const variables = { bookingId };

      console.log("Executing GraphQL query:", GET_BOOKING_FEEDBACK_QUERY, "with variables:", variables);

      const response = await dataConnect.executeGraphql(GET_BOOKING_FEEDBACK_QUERY, { variables });

      const feedbacks = response.data?.feedbacks || [];

      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Booking feedback retrieved successfully",
        data: feedbacks,
      });
    } catch (error) {
      console.error("Error retrieving booking feedback:", error);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Failed to retrieve booking feedback",
        error: error.message,
      });
    }
  }

module.exports = {
  getFeedbackByRating,
  getAllFeedback,
  getBookingFeedback
};