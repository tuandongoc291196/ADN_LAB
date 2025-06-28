const { dataConnect } = require("../../config/firebase.js");
const {checkBookingExists} = require("../bookings/bookingUtils.js");

const getBookingHistoryByBookingId = async (bookingId) => {
    try {
        if (!bookingId) {
            throw new Error("bookingId is required");
        }

        const GET_BOOKING_HISTORY = `
            query GetBookingHistory($bookingId: String!) @auth(level: USER) {
                bookingHistories(where: {bookingId: {eq: $bookingId}}, orderBy: {createdAt: DESC}) {
                    id
                    description
                    status
                    createdAt
                    updatedAt
                }
            }
        `;

        const variables = {
            bookingId: bookingId
        };

        console.log("Fetching booking history for booking ID:", bookingId);
        const response = await dataConnect.executeGraphql(GET_BOOKING_HISTORY, { 
            variables: variables 
        });

        const responseData = response.data.bookingHistories;
        if (!responseData || responseData.length === 0) {
            console.log("No booking history found for booking ID:", bookingId);
            return [];
        } else {
            return responseData;
        }
    } catch (error) {
        throw new Error(`Failed to fetch booking history: ${error.message}`);
    }
}

const getBookingHistories = async (req, res) => {
    const {bookingId} = req.body;    
    try {
        if (!bookingId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "bookingId is required"
            });
        }

        if (!await checkBookingExists(bookingId)) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "Booking not found"
            });
        }
        
        const GET_BOOKING_HISTORY = `
            query GetBookingHistory($bookingId: String!) @auth(level: USER) {
                bookingHistories(where: {bookingId: {eq: $bookingId}}, orderBy: {createdAt: DESC}) {
                    id
                    description
                    status
                    createdAt
                    updatedAt
                }
            }
        `;

        const variables = {
            bookingId: bookingId
        };

        console.log("Fetching booking history for booking ID:", bookingId);
        const response = await dataConnect.executeGraphql(GET_BOOKING_HISTORY, {
            variables: variables
        });

        const bookingHistories = response.data.bookingHistories;
        if (!bookingHistories || bookingHistories.length === 0) {
            console.log("No booking history found for booking ID:", bookingId);
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "No booking history found for the provided booking ID"
            });
        }

        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Booking history fetched successfully",
            data: bookingHistories
        });
    } catch (error) {
        console.error("Error fetching booking history:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: `Failed to fetch booking history: ${error.message}`
        });
    }
}

module.exports = {
    getBookingHistoryByBookingId,
    getBookingHistories
};