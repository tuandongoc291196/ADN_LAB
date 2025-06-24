const { dataConnect } = require("../../config/firebase.js");

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

    const responseData = response.data.role;
    return responseData;
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
  getOneRoleById,
  checkRoleExists,
  getRoleByUserId,
};
