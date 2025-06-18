const { dataConnect } = require("../../config/firebase.js");

const getTestResultById = async (req, res) => {
    try {
      const { resultId } = req.params;

      // Validate input
      if (!resultId) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Test Result ID is required",
        });
      }

      const GET_TEST_RESULT_BY_ID_QUERY = `
        query GetTestResultById($resultId: String!) @auth(level: USER) {
          testResult(key: { id: $resultId }) {
            id
            booking {
              id
              user {
                fullname
                email
              }
            }
            sample {
              id
              collectionDate
            }
            service {
              title
              description
            }
            staff {
              fullname
            }
            verifier {
              fullname
            }
            testDate
            reportDate
            resultData
            status
            reportUrl
            notes
          }
        }
      `;

      const variables = { resultId };

      console.log("Executing GraphQL query:", GET_TEST_RESULT_BY_ID_QUERY, "with variables:", variables);

      const response = await dataConnect.executeGraphql(GET_TEST_RESULT_BY_ID_QUERY, { variables });

      const testResult = response.data?.testResult;

      if (!testResult) {
        return res.status(404).json({
          statusCode: 404,
          status: "error",
          message: "Test result not found",
        });
      }

      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Test result retrieved successfully",
        data: testResult,
      });
    } catch (error) {
      console.error("Error fetching test result:", error);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Failed to retrieve test result",
        error: error.message,
      });
    }
  }

  //GET /api/test-results?status(status=completed)
  const getTestResultsByStatus = async (req, res) => {
    try {
      const { status } = req.query;

      // Validate input
      if (!status) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Status is required",
        });
      }

      const GET_TEST_RESULTS_BY_STATUS_QUERY = `
        query GetTestResultsByStatus($status: String!) @auth(level: USER) {
          testResults(where: { status: { eq: $status } }) {
            id
            booking {
              user {
                fullname
              }
            }
            service {
              title
            }
            staff {
              fullname
            }
            testDate
            status
          }
        }
      `;

      const variables = { status };

      console.log("Executing GraphQL query:", GET_TEST_RESULTS_BY_STATUS_QUERY, "with variables:", variables);

      const response = await dataConnect.executeGraphql(GET_TEST_RESULTS_BY_STATUS_QUERY, { variables });

      const testResults = response.data?.testResults || [];

      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Test results retrieved successfully",
        data: testResults,
      });
    } catch (error) {
      console.error("Error fetching test results by status:", error);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Failed to retrieve test results",
        error: error.message,
      });
    }
  }

  //GET /api/test-results/user/userId(user-001)
  const getUserTestResults = async (req, res) => {
    try {
      const { userId } = req.params;

      // Validate input
      if (!userId) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "User ID is required",
        });
      }

      const GET_USER_TEST_RESULTS_QUERY = `
        query GetUserTestResults($userId: String!) @auth(level: USER) {
          testResults(where: { booking: { userId: { eq: $userId } } }, orderBy: { testDate: DESC }) {
            id
            service {
              title
            }
            testDate
            reportDate
            status
            reportUrl
          }
        }
      `;

      const variables = { userId };

      console.log("Executing GraphQL query:", GET_USER_TEST_RESULTS_QUERY, "with variables:", variables);

      const response = await dataConnect.executeGraphql(GET_USER_TEST_RESULTS_QUERY, { variables });

      const testResults = response.data?.testResults || [];

      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "User test results retrieved successfully",
        data: testResults,
      });
    } catch (error) {
      console.error("Error fetching user test results:", error);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Failed to retrieve user test results",
        error: error.message,
      });
    }
  }

  //GET /api/test-results/booking/bookingId(booking-001)
  const getBookingTestResults = async (req, res) => {
    try {
      const { bookingId } = req.params;

      // Validate input
      if (!bookingId) {
        return res.status(400).json({
          statusCode: 400,
          status: "error",
          message: "Booking ID is required",
        });
      }

      const GET_BOOKING_TEST_RESULTS_QUERY = `
        query GetBookingTestResults($bookingId: String!) @auth(level: USER) {
          testResults(where: { bookingId: { eq: $bookingId } }) {
            id
            sample {
              id
            }
            service {
              title
            }
            staff {
              fullname
            }
            verifier {
              fullname
            }
            testDate
            reportDate
            status
            reportUrl
            notes
          }
        }
      `;

      const variables = { bookingId };

      console.log("Executing GraphQL query:", GET_BOOKING_TEST_RESULTS_QUERY, "with variables:", variables);

      const response = await dataConnect.executeGraphql(GET_BOOKING_TEST_RESULTS_QUERY, { variables });

      const testResults = response.data?.testResults || [];

      res.status(200).json({
        statusCode: 200,
        status: "success",
        message: "Test results retrieved successfully",
        data: testResults,
      });
    } catch (error) {
      console.error("Error fetching test results:", error);
      res.status(500).json({
        statusCode: 500,
        status: "error",
        message: "Failed to retrieve test results",
        error: error.message,
      });
    }
  }

module.exports = {
  getTestResultById,
  getTestResultsByStatus,
  getUserTestResults,
  getBookingTestResults
};