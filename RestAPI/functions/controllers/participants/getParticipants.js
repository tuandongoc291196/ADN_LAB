const { dataConnect } = require("../../config/firebase.js");

const getParticipantsByBookingId = async (bookingId) => {
    try {
        if (!bookingId) {
            throw new Error("bookingId is required");
        }

        const GET_PARTICIPANTS_QUERY = `
            query GetBookingParticipants($bookingId: String!) @auth(level: USER) {
                participants(where: {bookingId: {eq: $bookingId}}) {
                    id
                    name
                    age
                    identification
                    gender
                    relationship
                    createdAt
                    updatedAt
                }
            }
        `;

        const variables = {
            bookingId
        };
        console.log("Retrieving participants with variables:", variables);
        const response = await dataConnect.executeGraphql(GET_PARTICIPANTS_QUERY, {
            variables: variables
        });
        const responseData = response.data.participants;
                if (!responseData || responseData.length === 0) {
            throw new Error("No participants found for the given bookingId");
        } 
        return responseData;
    } catch (error) {
        console.error("Error in getParticipantsByBookingId:", error);
        throw new Error("Failed to retrieve participants due to an internal error");
    }
};

module.exports = {
    getParticipantsByBookingId
};
