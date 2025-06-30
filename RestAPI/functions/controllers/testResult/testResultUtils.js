const { dataConnect } = require("../../config/firebase.js");

const checkTestResultExists = async (resultId) => {
    try {
        if (!resultId) {
            throw new Error("resultId is required");
        }

        const CHECK_TEST_RESULT = `
            query GetTestResultById($resultId: String!) @auth(level: USER) {
                testResult(key: {id: $resultId}) {
                    id
                    booking {
                        id
                        user {
                            fullname
                            email
                        }
                        service {
                            title
                            description
                        }
                        method {
                            name
                        }
                    }
                    sample {
                        id
                        collectionDate
                        participant {
                            name
                            age
                            gender
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
                    resultData
                    resultNotes
                    status
                    createdAt
                    updatedAt
                }
            }
        `;

        const variables = { 
            resultId: resultId 
        };

        const response = await dataConnect.executeGraphql(CHECK_TEST_RESULT, { 
            variables: variables
        });

        const responseData = response.data.testResult;
        if (!responseData) {
            return false
        } else return true;
    } catch (error) {
        console.error("Error checking test result existence:", error);
        throw new Error(`Failed to check test result existence: ${error.message}`);
    }
}

module.exports = {
    checkTestResultExists
};