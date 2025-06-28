const { dataConnect } = require("../../config/firebase.js");

const addBookingHistory = async (bookingId, status, description) => {
    try {
        if (!bookingId) {
            throw new Error("bookingId is required");
        }

        if (!status) {
            throw new Error("status is required");
        }

        if (!description) {
            throw new Error("description is required");
        }
        
        const bookingHistoryData = {
            id: `${bookingId}_HISTORY_${Date.now()}`,
            bookingId: bookingId,
            description: description,
            status: status,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const ADD_BOOKING_HISTORY = `
            mutation CreateBookingHistory($id: String!, $bookingId: String!, $description: String!, $status: String!) @auth(level: USER) {
                bookingHistory_insert(data: {id: $id, bookingId: $bookingId, description: $description, status: $status})
            }
        `;
        
        const variables = {
            id: bookingHistoryData.id,
            bookingId: bookingHistoryData.bookingId,
            description: bookingHistoryData.description,
            status: bookingHistoryData.status
        };

        console.log("Adding booking history for booking ID:", bookingId);
        const response = await dataConnect.executeGraphql(ADD_BOOKING_HISTORY, { 
            variables: variables 
        });

        const responseData = response.data.bookingHistory_insert;
        if (!responseData) {
            throw new Error("Failed to add booking history");
        }
        return {
            success: true,
            data: responseData
        };
    } catch (error) {
        throw new Error(`Failed to add booking history: ${error.message}`);
    }
};

module.exports = {
    addBookingHistory
};