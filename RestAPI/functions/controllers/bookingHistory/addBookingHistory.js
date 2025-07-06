const { dataConnect } = require("../../config/firebase.js");
const {addSample} = require("../sample/addSample.js");
const {createTestResult} = require("../testResult/addTestResult.js");
const {checkBookingExists} = require("../bookings/bookingUtils.js");
const {getBookingHistoryByBookingId} = require("./getBookingHistory.js");
const {updatePaymentStatusByBookingId} = require("../payments/updatePayments.js");

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

const addBookingHistoryById = async (req, res) => {
    try {
        const { bookingId, status, description } = req.body;

        if (!bookingId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "bookingId is required"
            });
        }

        if (!status) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "status is required"
            });
        }

        if (!description) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "description is required"
            });
        }

        if (!(await checkBookingExists(bookingId))) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "Booking does not exist"
            });
        }

        if (status === "SAMPLE_RECEIVED") {
            console.log("Adding sample for booking ID:", bookingId);
            await addSample(bookingId);
        }

        if (status === "RESULT_PENDING") {
            console.log("Adding test result for booking ID:", bookingId);
            await createTestResult(bookingId);
        }

        if (status === "BOOKED") {
            console.log("Booking history added with status BOOKED for booking ID:", bookingId);
            const latestHistory = await getBookingHistoryByBookingId(bookingId);

            console.log(`Processing booking ${bookingId} with latest history:`, latestHistory);
            console.log(`Status of latest history:`, latestHistory[0]?.status);
            if (latestHistory && latestHistory.length > 0 && latestHistory[0].status === "BOOKED") {
                return res.status(400).json({
                    statusCode: 400,
                    status: "error",
                    message: "Booking already exists with status BOOKED"
                });
            } else {
                console.log("Updating payment status for booking ID:", bookingId);
                await updatePaymentStatusByBookingId(bookingId, "SUCCESS", { status: "BOOKED", updatedAt: new Date().toISOString() });
            }
        }

        const result = await addBookingHistory(bookingId, status, description);
        return res.status(201).json({
            statusCode: 201,
            status: "success",
            message: "Booking history added successfully",
            data: result.data
        });
    } catch (error) {
        console.error("Error in addBookingHistoryById:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal server error"
        });
    }
}

module.exports = {
    addBookingHistory,
    addBookingHistoryById
};