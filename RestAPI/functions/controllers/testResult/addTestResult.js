const { dataConnect } = require("../../config/firebase.js");

const createTestResult = async (req, res) => {
  try {
    const { id, bookingId, sampleId, serviceId, staffId, testDate, resultData, notes } = req.body;

    // Validate input
    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Test Result ID is required",
      });
    }

    if (!bookingId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Booking ID is required",
      });
    }

    if (!sampleId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Sample ID is required",
      });
    }

    if (!serviceId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Service ID is required",
      });
    }

    const CREATE_TEST_RESULT_MUTATION = `
      mutation CreateTestResult($id: String!, $bookingId: String!, $sampleId: String!, $serviceId: String!, $staffId: String, $testDate: Date, $resultData: String, $notes: String) @auth(level: USER) {
        testResult_insert(data: { id: $id, bookingId: $bookingId, sampleId: $sampleId, serviceId: $serviceId, staffId: $staffId, testDate: $testDate, resultData: $resultData, notes: $notes, status: "pending" }) {
          id
          bookingId
          sampleId
          serviceId
          staffId
          testDate
          resultData
          notes
          status
        }
      }
    `;

    const variables = {
      id,
      bookingId,
      sampleId,
      serviceId,
      staffId: staffId || null,
      testDate: testDate || null,
      resultData: resultData || null,
      notes: notes || null,
    };

    console.log("Executing GraphQL mutation:", CREATE_TEST_RESULT_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(CREATE_TEST_RESULT_MUTATION, {
      variables,
    });

    const testResult = response.data?.testResult_insert;

    if (!testResult) {
      throw new Error("Failed to create test result");
    }

    res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Test result created successfully",
      data: testResult,
    });
  } catch (error) {
    console.error("Error creating test result:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to create test result",
      error: error.message,
    });
  }
};

module.exports = {
  createTestResult,
};