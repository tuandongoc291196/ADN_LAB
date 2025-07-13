const { dataConnect } = require("../../config/firebase.js");
const { checkBookingExists } = require("../bookings/bookingUtils.js");

const updateTestResult = async (req, res) => {
    try {
        const { 
            bookingId, 
            testMethod, 
            positive, 
            accuracy, 
            testType, 
            resultData, 
            resultNotes, 
            status 
        } = req.body;

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
                message: "Test result does not exist"
            });
        }

        if (!testMethod) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "testMethod is required"
            });
        }

        if (typeof positive !== 'boolean') {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "positive must be a boolean"
            });
        }

        if (accuracy !== undefined && (typeof accuracy !== 'number' || accuracy < 0 || accuracy > 100)) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "accuracy must be a number between 0 and 100"
            });
        }

        if (!testType) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "testType is required"
            });
        }

        if (!resultData) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "resultData is required"
            });
        }

        if (!resultNotes) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "resultNotes is required"
            });
        }

        if (!status) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "status is required"
            });
          }

        const UPDATE_TEST_RESULT = `
            mutation UpdateTestResult($bookingId: String!, $testMethod: String, $positive: Boolean, $accuracy: Float, $testType: String, $reportDate: Date, $resultData: String, $resultNotes: String, $status: String) @auth(level: USER) {
                testResult_updateMany(where: {bookingId: {eq: $bookingId}}, data: {testMethod: $testMethod, positive: $positive, accuracy: $accuracy, testType: $testType, reportDate: $reportDate, resultData: $resultData, resultNotes: $resultNotes, status: $status, updatedAt_expr: "request.time"})
            }
        `;

        const variables = {
            bookingId: bookingId,
            testMethod: testMethod,
            positive: positive,
            accuracy: accuracy,
            testType: testType,
            reportDate: new Date().toISOString().split('T')[0],
            resultData: resultData,
            resultNotes: resultNotes,
            status: status
        };

        console.log("Updating test result with ID:", bookingId);
        const response = await dataConnect.executeGraphql(UPDATE_TEST_RESULT, {
            variables: variables
        });

        const responseData = response.data.testResult_update;
        if (!responseData) {
            return res.status(500).json({
                statusCode: 500,
                status: "error",
                message: "Failed to update test result"
            });
        }
        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Test result updated successfully",
            data: responseData
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: `Internal server error: ${error.message}`
        });
    }
}

module.exports = {
    updateTestResult
};