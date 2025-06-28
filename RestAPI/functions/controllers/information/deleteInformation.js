const { dataConnect } = require("../../config/firebase.js");

const deleteInformationByBookingId = async (bookingId) => {
    try {
        if (!bookingId) {
            throw new Error("bookingId is required");
        }

        const DELETE_INFORMATION_MUTATION = `
            mutation DeleteInformation($bookingId: String!) @auth(level: USER) {
                information_deleteMany(where: {bookingId: {eq: $bookingId}})
            }
        `;

        const variables = {
            bookingId
        };
        console.log("Deleting information with variables:", variables);
        const response = await dataConnect.executeGraphql(DELETE_INFORMATION_MUTATION, {
            variables: variables
        });

        const responseData = response.data.information_deleteMany;
        console.log("Response from deleteInformation:", responseData);
        if (responseData === null || responseData === undefined) {
            throw new Error("Failed to delete information");
        }
        console.log(`Information deleted successfully: ${responseData} records deleted`);
        return responseData;    
    } catch (error) {
        console.error("Error in deleteInformationByBookingId:", error);
        throw new Error("Failed to delete information due to an internal error");
    } 
}

module.exports = { 
    deleteInformationByBookingId 
};