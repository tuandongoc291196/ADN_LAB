const { dataConnect } = require("../../config/firebase.js");

const updateRole = async (req, res) => {
  try {
    const { roleId, name, description } = req.body;

    // Validate input
    if (!roleId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Role ID is required",
      });
    }

    const UPDATE_ROLE_MUTATION = `
      mutation UpdateRole($roleId: String!, $name: String, $description: String) @auth(level: USER) {
        role_update(key: { id: $roleId }, data: { name: $name, description: $description, updatedAt_expr: "request.time" }) {
          id
          name
          description
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      roleId,
      name: name || null,
      description: description || null,
    };

    console.log("Executing GraphQL mutation:", UPDATE_ROLE_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(UPDATE_ROLE_MUTATION, {
      variables,
    });

    const role = response.data?.role_update;

    if (!role) {
      throw new Error("Failed to update role");
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Role updated successfully",
      data: role,
    });
  } catch (error) {
    console.error("Error updating role:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to update role",
      error: error.message,
    });
  }
};

module.exports = {
  updateRole,
};