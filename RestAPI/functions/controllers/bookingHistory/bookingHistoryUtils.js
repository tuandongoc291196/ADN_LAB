const { dataConnect } = require("../../config/firebase.js");

const {checkBookingExists} = async (bookingHistoryId) => {
    try {
        if (!bookingHistoryId) {
            throw new Error("bookingHistoryId is required");
        }

        const GET_BOOKING_HISTORY = `
        query GetBookingHistoryById($id: String!) {
            bookingHistory(id: $id) {
                id
                bookingId
                description
                status
                createdAt
                updatedAt
            }
        }` 

        const variables = {
            id: bookingHistoryId
        };

        console.log("Checking booking history existence for ID:", bookingHistoryId);
        const response = await dataConnect.executeGraphql(GET_BOOKING_HISTORY, { 
            variables: variables 
        });

        const responseData = response.data.bookingHistory;
        if (!responseData) {
            console.log("Booking history does not exist for ID:", bookingHistoryId);
            return false;
        } else return true; 
    } catch (error) {
        throw new Error(`Failed to check booking history existence: ${error.message}`);
    }
}

module.exports = { 
    checkBookingExists 
};