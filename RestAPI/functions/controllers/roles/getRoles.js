const { dataConnect } = require("../../config/firebase.js");
const {checkRoleExists} = require("./roleUtils.js");

const getAllRoles = async (req, res) => {
  try {
    const GET_ROLES_QUERY = `
      query GetRoles @auth(level: USER) {
        roles {
          id
          name
          description
          createdAt
          updatedAt
        }
      }
    `;
    console.log("Executing GraphQL query:", GET_ROLES_QUERY);
    
    const response = await dataConnect.executeGraphql(GET_ROLES_QUERY);

    const responseData = response.data;

    if (responseData.role === null) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "There is no role in the database",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Roles retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve roles",
      error: error.message,
    });
  }
};

const getOneRole = async (req, res) => {
  try {
    const { roleId } = req.body;

    if (!roleId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "roleId is required",
      });
    }

    if (!(await checkRoleExists(roleId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Role does not exist",
      });
    }

    const GET_ONE_ROLE_QUERY = `
    query GetRoleById($roleId: String!) @auth(level: USER) {
      role(key: {id: $roleId}) {
        id
        name
        description
        createdAt
        updatedAt
      }
    }
    `;

    const variables = {
      roleId : roleId,
    };

    console.log("Executing GraphQL query:", GET_ONE_ROLE_QUERY, "with variables:", variables);
    
    const response = await dataConnect.executeGraphql(GET_ONE_ROLE_QUERY, {
      variables: variables,
    }); 
    console.log("Response from GraphQL:", response);
    
    const responseData = response.data;
    if (responseData.role === null) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Role not found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Roles retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching roles:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve roles",
      error: error.message,
    });
  }
}

const getRoleByUserId = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    const GET_ROLE_BY_USER_QUERY = `
      query GetRoleByUserId($userId: String!) @auth(level: USER) {
        user(key: {id: $userId}) {
          id
          roleId
          role {
            id
            name
            description
          }
        }
      }
    `;

    const variables = {
      userId: userId,
    };

    console.log("Executing GraphQL query:", GET_ROLE_BY_USER_QUERY, "with variables:", variables);
    
    const response = await dataConnect.executeGraphql(GET_ROLE_BY_USER_QUERY, {
      variables: variables,
    });

    const responseData = response.data.user.role;
    console.log("Role data retrieved:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error retrieving role by user ID:", error);
    throw error;
  }
};
module.exports = {
  getAllRoles,
  getOneRole,
  getRoleByUserId,
};