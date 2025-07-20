const {dataConnect} = require("../../config/firebase.js");
const {checkBookingExists} = require("../bookings/bookingUtils.js");

const addFeedback = async (req, res) => {
    try {
        const {bookingId, rating, comment} = req.body;

        if (!bookingId) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                error: "bookingId is required"
            });
        }

        if (!(await checkBookingExists(bookingId))) {
            return res.status(404).json({
                statusCode: 400,
                success: false,
                error: "Booking not found"
            });
        }

        if (!rating) {
            return res.status(400).json({
                statusCode: 400,
                success: false,
                error: "rating is required"
            });
        }

        const id = `${bookingId}_FEEDBACK`;

        const variables = {
            id, 
            bookingId, 
            rating, 
            comment
        };

        const ADD_FEEDBACK_MUTATION = `
            mutation CreateFeedback($id: String!, $bookingId: String!, $rating: Int!, $comment: String) @auth(level: USER) {
                feedback_insert(data: {id: $id, bookingId: $bookingId, rating: $rating, comment: $comment})
            }
        `;

        console.log("Adding feedback for booking ID:", bookingId, "with variables:", variables);
        const response = await dataConnect.executeGraphql(ADD_FEEDBACK_MUTATION, {
            variables: variables,
        });
        const responseData = response.data.feedback_insert || {};

        return res.status(201).json({
            success: true,
            data: responseData,
            message: "Feedback added successfully"
        });
    } catch (error) {
        console.error("Error in addFeedback:", error);
        return res.status(500).json({
            success: false,
            error: "Failed to add feedback"
        });
    }
}

module.exports = {
    addFeedback
};