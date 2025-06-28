const { dataConnect } = require("../../config/firebase.js");

const deleteBookingHistoryByBookingId = async (bookingId) => {
    try {
        if (!bookingId) {
            throw new Error("bookingId is required");
        }

        const DELETE_BOOKING_HISTORY_MUTATION = `
            mutation DeleteBookingHistory($bookingId: String!) @auth(level: USER) {
                bookingHistory_deleteMany(where: {bookingId: {eq: $bookingId}})
            }
        `;

        const variables = {
            bookingId: bookingId
        };
        console.log("Deleting booking history with variables:", variables);
        const response = await dataConnect.executeGraphql(DELETE_BOOKING_HISTORY_MUTATION, {
            variables: variables
        });

        const responseData = response.data.bookingHistory_deleteMany;
        console.log("Response from deleteBookingHistory:", responseData);
        if (responseData === null || responseData === undefined) {
            throw new Error("Failed to delete booking history");
        }
        console.log(`Booking history deleted successfully: ${responseData} records deleted`);
        return responseData;    
    } catch (error) {
        console.error("Error in deleteBookingHistoryByBookingId:", error);
        throw new Error("Failed to delete booking history due to an internal error");
    } 
}

module.exports = { 
    deleteBookingHistoryByBookingId 
};