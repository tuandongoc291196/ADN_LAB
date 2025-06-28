const { dataConnect } = require("../../config/firebase.js");

const deleteParticipantsByBookingId = async (bookingId) => {
    try {
        if (!bookingId) {
            throw new Error("bookingId is required");
        }

        const DELETE_PARTICIPANTS_MUTATION = `
            mutation DeleteParticipants($bookingId: String!) @auth(level: USER) {
                participant_deleteMany(where: {bookingId: {eq: $bookingId}})
            }
        `;

        const variables = {
            bookingId
        };
        console.log("Deleting participants with variables:", variables);
        const response = await dataConnect.executeGraphql(DELETE_PARTICIPANTS_MUTATION, {
            variables: variables
        });

        const responseData = response.data.participant_deleteMany;
        console.log("Response from deleteParticipants:", responseData);
        if (responseData === null || responseData === undefined) {
            throw new Error("Failed to delete participants");
        }
        console.log(`Participants deleted successfully: ${responseData} participants deleted`);
        return responseData;    
    } catch (error) {
        console.error("Error in deleteParticipantsByBookingId:", error);
        throw new Error("Failed to delete participants due to an internal error");
    } 
}

module.exports = { 
    deleteParticipantsByBookingId 
};