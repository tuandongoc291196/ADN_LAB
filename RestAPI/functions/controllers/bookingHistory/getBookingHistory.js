const { dataConnect } = require("../../config/firebase.js");

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

module.exports = {
    getBookingHistoryByBookingId
};