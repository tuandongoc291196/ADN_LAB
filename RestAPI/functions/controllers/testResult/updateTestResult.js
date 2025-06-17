const { dataConnect } = require("../../config/firebase.js");

const updateTestResult = async (req, res) => {
  try {
    const { resultId, resultData, status, reportDate, reportUrl, notes } = req.body;

    // Validate input
    if (!resultId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Test Result ID is required",
      });
    }

    const UPDATE_TEST_RESULT_MUTATION = `
      mutation UpdateTestResult($resultId: String!, $resultData: String, $status: String, $reportDate: Date, $reportUrl: String, $notes: String) @auth(level: USER) {
        testResult_update(key: { id: $resultId }, data: { resultData: $resultData, status: $status, reportDate: $reportDate, reportUrl: $reportUrl, notes: $notes }) {
          id
          resultData
          status
          reportDate
          reportUrl
          notes
        }
      }
    `;

    const variables = {
      resultId,
      resultData: resultData || null,
      status: status || null,
      reportDate: reportDate || null,
      reportUrl: reportUrl || null,
      notes: notes || null,
    };

    console.log("Executing GraphQL mutation:", UPDATE_TEST_RESULT_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(UPDATE_TEST_RESULT_MUTATION, {
      variables,
    });

    const testResult = response.data?.testResult_update;

    if (!testResult) {
      throw new Error("Failed to update test result");
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Test result updated successfully",
      data: testResult,
    });
  } catch (error) {
    console.error("Error updating test result:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to update test result",
      error: error.message,
    });
  }
};

module.exports = {
  updateTestResult,
};