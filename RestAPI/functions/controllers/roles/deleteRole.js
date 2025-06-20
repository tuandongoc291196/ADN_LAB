const { dataConnect } = require("../../config/firebase.js");
const { checkRoleExists } = require('../roles/getRoles.js');

const deleteRole = async (req, res) => {
  try {
    const {roleId} = req.body;

    if (!roleId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "roleId is required",
      });
    }

    console.log("Checking if role exists before deletion, roleId:", roleId);
    const existingRole = await checkRoleExists(roleId);
    console.log("Role existence check result:", existingRole);
    if (!existingRole) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Role not found",
        error: "Role with the provided ID does not exist",
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
      variables : variables,
    });

    const responseData = response.data;

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Role deleted successfully",
      data: responseData,
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