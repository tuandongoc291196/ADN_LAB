const { dataConnect } = require("../../config/firebase.js");

const deleteRole = async (req, res) => {
  try {
    const { roleId } = req.body;

    // Validate input
    if (!roleId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Role ID is required",
      });
    }

    const DELETE_ROLE_MUTATION = `
      mutation DeleteRole($roleId: String!) @auth(level: USER) {
        role_delete(key: { id: $roleId })
      }
    `;

    const variables = {
      roleId,
    };

    console.log("Executing GraphQL mutation:", DELETE_ROLE_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(DELETE_ROLE_MUTATION, {
      variables,
    });

    const result = response.data?.role_delete;

    if (!result) {
      throw new Error("Failed to delete role");
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Role deleted successfully",
      data: { roleId },
    });
  } catch (error) {
    console.error("Error deleting role:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to delete role",
      error: error.message,
    });
  }
};

module.exports = {
  deleteRole,
};