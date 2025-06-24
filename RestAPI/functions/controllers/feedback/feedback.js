const { dataConnect } = require("../../config/firebase.js");
const { v4: uuidv4 } = require('uuid');

// ================== UTILITY FUNCTIONS ==================

const checkFeedbackExists = async (feedbackId) => {
  try {
    const CHECK_FEEDBACK_EXISTS_QUERY = `
      query GetFeedbackById($feedbackId: String!) @auth(level: USER) {
        feedback(key: { id: $feedbackId }) {
          id
          bookingId
          rating
          comment
          createdAt
        }
      }
    `;

    const variables = { feedbackId };
    
    const response = await dataConnect.executeGraphql(CHECK_FEEDBACK_EXISTS_QUERY, { 
      variables 
    });
    
    return response.data.feedback ? true : false;
  } catch (error) {
    console.error("Error checking feedback existence:", error);
    throw error;
  }
};

const checkBookingExists = async (bookingId) => {
  try {
    const CHECK_BOOKING_EXISTS_QUERY = `
      query GetBookingById($bookingId: String!) @auth(level: USER) {
        booking(key: { id: $bookingId }) {
          id
        }
      }
    `;

    const variables = { bookingId };
    const response = await dataConnect.executeGraphql(CHECK_BOOKING_EXISTS_QUERY, { 
      variables 
    });
    
    return response.data.booking ? true : false;
  } catch (error) {
    console.error("Error checking booking existence:", error);
    throw error;
  }
};

const validateFeedbackData = (feedbackData) => {
  const { rating, bookingId } = feedbackData;
  
  if (!rating || typeof rating !== 'number' || rating < 1 || rating > 5) {
    return { isValid: false, message: "Rating is required and must be a number between 1 and 5" };
  }
  
  if (!bookingId || typeof bookingId !== 'string' || bookingId.trim().length === 0) {
    return { isValid: false, message: "BookingId is required and must be a non-empty string" };
  }
  
  return { isValid: true };
};

const getFeedbackByBookingId = async (bookingId) => {
  try {
    const GET_FEEDBACK_BY_BOOKING_QUERY = `
      query GetFeedbackByBooking($bookingId: String!) @auth(level: USER) {
        feedbacks(where: { bookingId: { eq: $bookingId } }) {
          id
          bookingId
          rating
          comment
          createdAt
          booking {
            id
            service {
              title
              description
            }
            user {
              fullname
              email
            }
          }
        }
      }
    `;

    const variables = { bookingId };
    
    const response = await dataConnect.executeGraphql(GET_FEEDBACK_BY_BOOKING_QUERY, { 
      variables 
    });
    
    return response.data.feedbacks || [];
  } catch (error) {
    console.error("Error getting feedback by booking ID:", error);
    throw error;
  }
};

// ================== API ENDPOINTS ==================

const addFeedback = async (req, res) => {
  try {
    const {
      bookingId,
      rating,
      comment
    } = req.body;

    // Validate required fields
    const validation = validateFeedbackData({ rating, bookingId });
    if (!validation.isValid) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: validation.message,
      });
    }

    // Check if booking exists
    if (!(await checkBookingExists(bookingId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Booking not found",
      });
    }

    // Check if feedback already exists for this booking
    const existingFeedback = await getFeedbackByBookingId(bookingId);
    if (existingFeedback.length > 0) {
      return res.status(409).json({
        statusCode: 409,
        status: "error",
        message: "Feedback already exists for this booking",
      });
    }

    const feedbackId = uuidv4();

    const CREATE_FEEDBACK_MUTATION = `
      mutation CreateFeedback($id: String!, $bookingId: String!, $rating: Int!, $comment: String) @auth(level: USER) {
        feedback_insert(data: {
          id: $id,
          bookingId: $bookingId,
          rating: $rating,
          comment: $comment
        })
      }
    `;

    const variables = {
      id: feedbackId,
      bookingId,
      rating,
      comment: comment || null
    };

    const response = await dataConnect.executeGraphql(CREATE_FEEDBACK_MUTATION, {
      variables,
    });

    return res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Feedback created successfully",
      data: {
        feedbackId,
        ...variables
      },
    });

  } catch (error) {
    console.error("Error creating feedback:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to create feedback",
      error: error.message,
    });
  }
};

const getFeedbacksByBooking = async (req, res) => {
  try {
    const { bookingId } = req.body;

    if (!bookingId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "bookingId is required",
      });
    }

    const feedbacks = await getFeedbackByBookingId(bookingId);

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Feedbacks retrieved successfully",
      data: feedbacks,
      count: feedbacks.length,
    });

  } catch (error) {
    console.error("Error getting feedbacks:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to get feedbacks",
      error: error.message,
    });
  }
};

const getOneFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.body;

    if (!feedbackId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "feedbackId is required",
      });
    }

    const GET_FEEDBACK_QUERY = `
      query GetFeedback($feedbackId: String!) @auth(level: USER) {
        feedback(key: { id: $feedbackId }) {
          id
          bookingId
          rating
          comment
          createdAt
          booking {
            id
            service {
              title
              description
            }
            user {
              fullname
              email
            }
            totalAmount
          }
        }
      }
    `;

    const variables = { feedbackId };

    const response = await dataConnect.executeGraphql(GET_FEEDBACK_QUERY, {
      variables,
    });

    const feedback = response.data.feedback;

    if (!feedback) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Feedback not found",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Feedback retrieved successfully",
      data: feedback,
    });

  } catch (error) {
    console.error("Error getting feedback:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to get feedback",
      error: error.message,
    });
  }
};

const getAllFeedbacks = async (req, res) => {
  try {
    const GET_ALL_FEEDBACKS_QUERY = `
      query GetAllFeedbacks @auth(level: USER) {
        feedbacks(orderBy: { createdAt: DESC }) {
          id
          bookingId
          rating
          comment
          createdAt
          booking {
            id
            service {
              title
              description
            }
            user {
              fullname
              email
            }
            totalAmount
          }
        }
      }
    `;

    const response = await dataConnect.executeGraphql(GET_ALL_FEEDBACKS_QUERY);
    const feedbacks = response.data.feedbacks || [];

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "All feedbacks retrieved successfully",
      data: feedbacks,
      count: feedbacks.length,
    });

  } catch (error) {
    console.error("Error getting all feedbacks:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to get all feedbacks",
      error: error.message,
    });
  }
};

const updateFeedback = async (req, res) => {
  try {
    const {
      feedbackId,
      rating,
      comment
    } = req.body;

    if (!feedbackId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "feedbackId is required",
      });
    }

    if (!(await checkFeedbackExists(feedbackId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Feedback not found",
      });
    }

    // Validate fields if provided
    if (rating !== undefined && (typeof rating !== 'number' || rating < 1 || rating > 5)) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Rating must be a number between 1 and 5",
      });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (rating !== undefined) updateData.rating = rating;
    if (comment !== undefined) updateData.comment = comment;

    if (Object.keys(updateData).length === 0) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "At least one field must be provided for update",
      });
    }

    const UPDATE_FEEDBACK_MUTATION = `
      mutation UpdateFeedback($feedbackId: String!, $data: Feedback_Data!) @auth(level: USER) {
        feedback_update(key: { id: $feedbackId }, data: $data)
      }
    `;

    const variables = {
      feedbackId,
      data: updateData
    };

    const response = await dataConnect.executeGraphql(UPDATE_FEEDBACK_MUTATION, {
      variables,
    });

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Feedback updated successfully",
      data: {
        feedbackId,
        updatedFields: updateData
      },
    });

  } catch (error) {
    console.error("Error updating feedback:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to update feedback",
      error: error.message,
    });
  }
};

const deleteFeedback = async (req, res) => {
  try {
    const { feedbackId } = req.body;

    if (!feedbackId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "feedbackId is required",
      });
    }

    if (!(await checkFeedbackExists(feedbackId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Feedback not found",
      });
    }

    const DELETE_FEEDBACK_MUTATION = `
      mutation DeleteFeedback($feedbackId: String!) @auth(level: USER) {
        feedback_delete(key: { id: $feedbackId })
      }
    `;

    const variables = { feedbackId };

    const response = await dataConnect.executeGraphql(DELETE_FEEDBACK_MUTATION, {
      variables,
    });

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Feedback deleted successfully",
      data: {
        feedbackId,
        deletedAt: new Date().toISOString()
      },
    });

  } catch (error) {
    console.error("Error deleting feedback:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to delete feedback",
      error: error.message,
    });
  }
};

module.exports = {
  // Utility functions
  checkFeedbackExists,
  validateFeedbackData,
  getFeedbackByBookingId,
  checkBookingExists,
  
  // API endpoints
  addFeedback,
  getFeedbacksByBooking,
  getOneFeedback,
  getAllFeedbacks,
  updateFeedback,
  deleteFeedback,
}; 