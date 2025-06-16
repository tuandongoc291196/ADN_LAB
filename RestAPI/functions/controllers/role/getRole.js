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

    const roles = response.data?.roles || [];

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Roles retrieved successfully",
      data: roles,
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

module.exports = {
  getAllRoles,
};