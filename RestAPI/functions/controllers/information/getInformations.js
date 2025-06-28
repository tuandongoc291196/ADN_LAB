const { dataConnect } = require("../../config/firebase.js");

const getInformationByBookingId = async (bookingId) => {
    try {
        if (!bookingId) {
            throw new Error("bookingId is required");
        }

        const GET_INFORMATION_QUERY = `
            query GetBookingInformation($bookingId: String!) @auth(level: USER) {
                informations(where: {bookingId: {eq: $bookingId}}) {
                    id
                    name
                    identification
                    address
                    phone
                    email
                    createdAt
                    updatedAt
                }
            }
        `;

        const variables = {
            bookingId
        };
        console.log("Retrieving information with variables:", variables);
        const response = await dataConnect.executeGraphql(GET_INFORMATION_QUERY, {
            variables: variables
        });
        const responseData = response.data.informations;
        if (!responseData || responseData.length === 0) {
            throw new Error("No information found for the given bookingId");
        } 
        return responseData;
    } catch (error) {
        console.error("Error in getInformationByBookingId:", error);
        throw new Error("Failed to retrieve information due to an internal error");
    }
};

module.exports = {
    getInformationByBookingId
};