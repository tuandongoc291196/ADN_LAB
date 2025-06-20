const { dataConnect } = require("../../config/firebase.js");

const updateFeedback = async (req, res) => {
  try {
    const { feedbackId, rating, comment } = req.body;

    // Validate input
    if (!feedbackId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Feedback ID is required",
      });
    }

    const UPDATE_FEEDBACK_MUTATION = `
      mutation UpdateFeedback($feedbackId: String!, $rating: Int, $comment: String) @auth(level: USER) {
        feedback_update(key: { id: $feedbackId }, data: { rating: $rating, comment: $comment }) {
          id
          bookingId
          rating
          comment
        }
      }
    `;

    const variables = {
      feedbackId,
      rating: rating || null,
      comment: comment || null,
    };

    console.log("Executing GraphQL mutation:", UPDATE_FEEDBACK_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(UPDATE_FEEDBACK_MUTATION, {
      variables,
    });

    const feedback = response.data?.feedback_update;

    if (!feedback) {
      throw new Error("Failed to update feedback");
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Feedback updated successfully",
      data: feedback,
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

module.exports = {
  updateFeedback,
};