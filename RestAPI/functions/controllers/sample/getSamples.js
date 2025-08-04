const { dataConnect } = require("../../config/firebase.js");
const {checkBookingExists} = require("../bookings/bookingUtils.js");

const getSamples = async (bookingId) => {

    try {
        if (!bookingId) {
        throw new Error("bookingId is required");
    }

    const GET_SAMPLES = `
    query GetSamplesByBookingId($bookingId: String!) {
            samples(where: { bookingId: { eq: $bookingId } }) {
                id
                bookingId
                staffId
                participantId
                collectionDate
                sampleQuality
                sampleType
                sampleConcentration
                notes
                createdAt
                updatedAt
                booking {
                id
                totalAmount
                service {
                    title
                }
                }
                staff {
                id
                user {
                    fullname
                }
                }
                participant {
                id
                name
                age
                gender
                relationship
                }
            }
        }
    `;

    const variables = {
        bookingId: bookingId
    };  

    console.log("Fetching samples for booking ID:", bookingId, "with variables:", variables);
    const response = await dataConnect.executeGraphql(GET_SAMPLES, { 
        variables: variables 
    });

    const responseData = response.data.samples;
    if (!responseData || responseData.length === 0) {   
        throw new Error("No samples found for the given bookingId");
    }
    return responseData;
    } catch (error) {
        console.error("Error in getSamples:", error);
        throw new Error("Failed to fetch samples");
    }
}

const getSampleBybookingId = async (req, res) => {
    try {
        const { bookingId } = req.body;
        if (!bookingId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "bookingId is required"
            });
        }

        if (!(await checkBookingExists(bookingId))) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "Booking not found"
            });
        }
        
        const GET_SAMPLE_BY_BOOKING_ID = `
        query GetSamplesByBookingId($bookingId: String!) {
            samples(where: { bookingId: { eq: $bookingId } }) {
                id
                bookingId
                staffId
                participantId
                collectionDate
                sampleQuality
                sampleType
                sampleConcentration
                notes
                createdAt
                updatedAt
                booking {
                id
                totalAmount
                service {
                    title
                }
                }
                staff {
                id
                user {
                    fullname
                }
                }
                participant {
                id
                name
                age
                gender
                relationship
                }
            }
        }
        `;

        const variables = { 
            bookingId: bookingId 
        };
        console.log("Fetching samples for booking ID:", bookingId, "with variables:", variables);
        const response = await dataConnect.executeGraphql(GET_SAMPLE_BY_BOOKING_ID, { 
            variables: variables 
        });

        const responseData = response.data.samples;
        if (!responseData || responseData.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "No samples found for the given bookingId"
            });
        }
        return res.status(200).json({
            statusCode: 200,
            status: "success",
            data: responseData
        });
    } catch (error) {
        console.error("Error fetching samples by bookingId:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal server error"
        });
    }
}

module.exports = {
    getSampleBybookingId, 
    getSamples
};