const { dataConnect } = require("../../config/firebase.js");

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

const getOneRoleById = async (roleId) => {
  try {
    if (!roleId) {
      throw new Error("roleId is required");
    }
    
    const variables = {
      roleId: roleId,
    };

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

    console.log("Executing GraphQL query:", GET_ONE_ROLE_QUERY, "with variables:", variables);
    const response = await dataConnect.executeGraphql(GET_ONE_ROLE_QUERY, {
      variables: variables,
    });

    const reqponseData = response.data.role;
    return reqponseData;
  } catch (error) {
    console.error("Error retrieving role:", error);
    throw error;
  }
};

const checkRoleExists = async (roleId) => {
  try {
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
      roleId: roleId,
    };

    const response = await dataConnect.executeGraphql(GET_ONE_ROLE_QUERY, {
      variables: variables,
    }); 
    
    const responseData = response.data.role;
    if (!responseData) {
      return false;
    } else return true; 
  } catch (error) {
    console.error("Error checking if role exists:", error);
    throw error;
  }
};

const getRoleByUserId = async (userId) => {
  try {
    const GET_ROLE_BY_USER_QUERY = `
      query GetRoleByUserId($userId: String!) @auth(level: USER) {
        user(key: {id: $userId}) {
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

    const response = await dataConnect.executeGraphql(GET_ROLE_BY_USER_QUERY, {
      variables: variables,
    });

    return response.data.user.role;
  } catch (error) {
    console.error("Error fetching role by user ID:", error);
    throw error;
  }
}

module.exports = {
  getAllRoles,
  getOneRole,
  checkRoleExists,
  getRoleByUserId,
  getOneRoleById
};