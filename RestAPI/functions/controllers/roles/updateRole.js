const { dataConnect } = require("../../config/firebase.js");
const { checkRoleExists } = require('./roleUtils.js');

const updateRole = async (req, res) => {
  try {
    const { roleId, name, description } = req.body;

    if (!roleId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "roleId is required",
      });
    }

    if(!(await checkRoleExists(roleId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Role does not exist",
      });
    }

    const UPDATE_ROLE_MUTATION = `
      mutation UpdateRole($roleId: String!, $name: String, $description: String) @auth(level: USER) {
        role_update(key: {id: $roleId}, data: {name: $name, description: $description, updatedAt_expr: "request.time"})
      }
    `;

    const variables = {
      roleId,
      name: name || "",
      description: description || "",
    };

    console.log("Executing GraphQL mutation:", UPDATE_ROLE_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(UPDATE_ROLE_MUTATION, {
      variables,
    });

    const responseData = response.data.role_update;
    console.log("Response data:", responseData);

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Role updated successfully",
      data: responseData,
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