const { dataConnect } = require("../../config/firebase.js");

const getAllMethods = async (req, res) => {
  try {

    const GET_ALL_METHODS_QUERY = `
        query GetMethods @auth(level: USER) {
            methods(orderBy: {name: ASC}) {
            id
            name
            description
            price
            createdAt
            updatedAt
            }
        }
    `;

    console.log("Executing GraphQL query:", GET_ALL_METHODS_QUERY);
    const response = await dataConnect.executeGraphql(GET_ALL_METHODS_QUERY);
    const responseData = response.data.methods || [];
    if (!responseData || responseData.length === 0) {
      console.log("No methods found");
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "No methods found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Methods retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching methods:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve methods",
      error: error.message,
    });
  }
};

const getOneMethod = async (req, res) => {
  try {
    const {methodId} = req.body;

    if (!methodId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "methodId is required",
      });
    }

    if (!(await checkMethodExists(methodId))) {
      console.log(await checkMethodExists(methodId));
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Method does not exist",
      });
    }

    const variables = {methodId};
    const GET_ONE_METHOD_QUERY = `
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
    
    console.log("Executing GraphQL query:", GET_ONE_METHOD_QUERY, "with variables:", variables);
    const response = await dataConnect.executeGraphql(GET_ONE_METHOD_QUERY, {
      variables: variables,
    });

    const responseData = response.data.method;

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Method retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching method:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve method",
      error: error.message,
    });
  }
};

const checkMethodExists = async (methodId) => { 
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
    
    respondData = response.data.method;
    console.log("Response data:", respondData);

    if (!respondData) {
        return false;
    } else return true;
}

module.exports = {
  getAllMethods,
  getOneMethod,
  checkMethodExists,
};