const { dataConnect } = require("../../config/firebase.js");
const {checkBookingExists} = require("../bookings/bookingUtils.js");
const {checkUserExists} = require("../users/userUtils.js");
const {checkStaffExists} = require("../users/userUtils.js");

const getTestResultByBookingId = async (req, res) => {
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

        const GET_TEST_RESULT_QUERY = `
            query GetBookingTestResults($bookingId: String!) @auth(level: USER) {
              testResults(where: {bookingId: {eq: $bookingId}}) {
                id
                sample {
                  id
                  participant {
                    name
                  }
                }
                booking {
                  service {
                    title
                  }
                }
                staff {
                  user {
                    fullname
                  }
                  position {
                    name
                  }
                }
                manager {
                  user {
                    fullname
                  }
                  position {
                    name
                  }
                }
                testMethod
                positive
                accuracy
                testType
                testDate
                reportDate
                status
                createdAt
                updatedAt
              }
            }
        `;

        const variables = { 
          bookingId: bookingId 
        };

        const response = await dataConnect.executeGraphql(GET_TEST_RESULT_QUERY, {
            variables: variables
        });

        const responseData = response.data.testResults;
        if (!responseData || responseData.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "No test results found for this booking"
            });
        }
        return res.status(200).json({
            statusCode: 200,
            status: "success",
            data: responseData
        });
    } catch (error) {
        console.error("Error fetching test results by bookingId:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal server error"
        });
    }
};

const getTestResultByUserId = async (req, res) => {
    try {
        const { userId } = req.body;
        if (!userId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "userId is required"
            });
        }

        if (!(await checkUserExists(userId))) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "User not found"
            });
        }

        const GET_TEST_RESULT_BY_USER_QUERY = `
          query GetUserTestResults($userId: String!) @auth(level: USER) {
            testResults(where: {booking: {userId: {eq: $userId}}}, orderBy: {testDate: DESC}) {
              id
              booking {
                service {
                  title
                }
              }
              staff {
                user {
                  fullname
                }
                position {
                  name
                }
              }
              manager {
                user {
                  fullname
                }
                position {
                  name
                }
              }
              testMethod
              positive
              accuracy
              testType
              testDate
              reportDate
              status
              createdAt
            }
          }
      `;

        const variables = { 
          userId: userId
        };

        const response = await dataConnect.executeGraphql(GET_TEST_RESULT_BY_USER_QUERY, {
            variables: variables
        });
        const responseData = response.data.testResults;
        if (!responseData || responseData.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "No test results found for this user"
            });
        }
        return res.status(200).json({
            statusCode: 200,
            status: "success",
            data: responseData
        });
    } catch (error) {
        console.error("Error fetching test results by userId:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal server error"
        });
    }
};

const getTestResultByStaffId = async (req, res) => {
    try {
        const { staffId } = req.body;
        if (!staffId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "staffId is required"
            });
        }

        if (!(await checkStaffExists(staffId))) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "Staff member not found"
            });
        }
        
        const GET_TEST_RESULT_BY_STAFF_QUERY = `
          query GetStaffTestResults($staffId: String!) @auth(level: USER) {
            testResults(where: {staffId: {eq: $staffId}}, orderBy: {createdAt: DESC}) {
              id
              booking {
                user {
                  fullname
                }
                service {
                  title
                }
              }
              sample {
                participant {
                  name
                }
              }
              staff {
                user {
                  fullname
                }
                position {
                  name
                }
              }
              manager {
                user {
                  fullname
                }
                position {
                  name
                }
              }
              testMethod
              positive
              accuracy
              testType
              testDate
              reportDate
              status
              createdAt
            }
          }
        `;

        const variables = { 
          staffId: staffId
        };

        const response = await dataConnect.executeGraphql(GET_TEST_RESULT_BY_STAFF_QUERY, {
            variables: variables
        });
        const responseData = response.data.testResults;
        if (!responseData || responseData.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "No test results found for this staff member"
            });
        }
        return res.status(200).json({
            statusCode: 200,
            status: "success",
            data: responseData
        });
    } catch (error) {
        console.error("Error fetching test results by staffId:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal server error"
        });
    }
};

module.exports = {
    getTestResultByBookingId, 
    getTestResultByUserId,
    getTestResultByStaffId
};