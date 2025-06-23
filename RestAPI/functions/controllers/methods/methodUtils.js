const { dataConnect } = require("../../config/firebase.js");

const checkMethodExists = async (methodId) => { 
    try {
        if (!methodId) {
          throw new Error("methodId is required");
        }

        const variables = {methodId};
        const GET_METHOD_QUERY = `
            query GetMethodById($methodId: String!) @auth(level: USER) {
                method(key: {id: $methodId}) {
                    id
                    name
                    description
                    price
                    createdAt
                    updatedAt
                }
            }
        `;
        
        console.log("Executing GraphQL query:", GET_METHOD_QUERY, "with variables:", variables);
        const response = await dataConnect.executeGraphql(GET_METHOD_QUERY, {
          variables: variables,
        });
        
        const responseData = response.data.method;
        console.log("Response data:", responseData);

        if (!responseData) {
            return false;
        } else return true;
    } catch (error) {
        console.error("Error checking method existence:", error);
        throw new Error("Failed to check method existence");
    }
}

module.exports = {
  checkMethodExists,
};