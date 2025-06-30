const { dataConnect } = require("../../config/firebase.js");
const {getSamples} = require("../sample/getSamples.js");
const {getActiveStaffWithLowestSlotCount} = require("../users/userUtils.js");

const createTestResult = async (bookingId) => {
  try {
    if (!bookingId) {
      throw new Error("bookingId is required");
    }

    const samples = await getSamples(bookingId);
    const managerId = await getActiveStaffWithLowestSlotCount("2");

    const CREATE_TEST_RESULT_MUTATION = `
      mutation CreateTestResult(
        $id: String!,
        $bookingId: String!,
        $sampleId: String!,
        $staffId: String!,
        $managerId: String!,
        $testMethod: String!,
        $positive: Boolean!,
        $accuracy: Float!,
        $testType: String!,
        $testDate: Date,
        $reportDate: Date,
        $resultData: String,
        $resultNotes: String,
        $status: String
      ) @auth(level: USER) {
        testResult_insert(data: {
          id: $id,
          bookingId: $bookingId,
          sampleId: $sampleId,
          staffId: $staffId,
          managerId: $managerId,
          testMethod: $testMethod,
          positive: $positive,
          accuracy: $accuracy,
          testType: $testType,
          testDate: $testDate,
          reportDate: $reportDate,
          resultData: $resultData,
          resultNotes: $resultNotes,
          status: $status
        })
      }
    `;

    const testResults = [];

    // Create test result for each sample
    for (const sample of samples) {
      const testResultId = `${sample.id}RESULT`;
      
      const variables = {
        id: testResultId,
        bookingId: bookingId,
        sampleId: sample.id,
        staffId: sample.staffId,
        managerId: managerId,
        testMethod: "Standard Analysis",
        positive: false,
        accuracy: 0,
        testType: "",
        testDate: new Date().toISOString().split('T')[0],
        reportDate: null,
        resultData: null,
        resultNotes: `Test result for sample ${sample.id}`,
        status: "pending"
      };

      console.log("Creating test result for sample:", sample.id, "with variables:", variables);
      
      const response = await dataConnect.executeGraphql(CREATE_TEST_RESULT_MUTATION, {
        variables: variables
      });

      const testResult = response.data.testResult_insert;
      testResults.push(testResult);
    }

    console.log(`Successfully created ${testResults.length} test results for booking ${bookingId}`);
    return testResults;
    
  } catch (error) {
    console.error("Error creating test result:", error);
    throw new Error("Failed to create test result: " + error.message);
  }
};

module.exports = {
  createTestResult,
};