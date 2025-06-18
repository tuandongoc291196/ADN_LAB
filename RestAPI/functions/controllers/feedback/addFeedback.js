const { dataConnect } = require("../../config/firebase.js");

const createFeedback = async (req, res) => {
  try {
    const { id, bookingId, rating, comment } = req.body;

    // Validate input
    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Feedback ID is required",
      });
    }

    if (!bookingId) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Booking ID is required",
        });
      }

      if (!rating) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Rating is required",
        });
      }

    const CREATE_FEEDBACK_MUTATION = `
      mutation CreateFeedback($id: String!, $bookingId: String!, $rating: Int!, $comment: String) @auth(level: USER) {
        feedback_insert(data: { id: $id, bookingId: $bookingId, rating: $rating, comment: $comment }) {
          id
          bookingId
          rating
          comment
        }
      }
    `;

    const variables = {
      id,
      bookingId,
      rating,
      comment: comment || null,
    };

    console.log("Executing GraphQL mutation:", CREATE_FEEDBACK_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(CREATE_FEEDBACK_MUTATION, {
      variables,
    });

    const feedback = response.data?.feedback_insert;

    if (!feedback) {
      throw new Error("Failed to create feedback");
    }

    res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Feedback created successfully",
      data: feedback,
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

module.exports = {
  createFeedback,
};