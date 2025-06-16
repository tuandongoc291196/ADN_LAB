const { dataConnect } = require("../../config/firebase.js");

const createRole = async (req, res) => {
  try {
    const { id, name, description } = req.body;

    // Validate input
    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Role ID is required",
      });
    }

    if (!name) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Role name is required",
      });
    }

    const CREATE_ROLE_MUTATION = `
      mutation CreateRole($id: String!, $name: String!, $description: String) @auth(level: USER) {
        role_insert(data: { id: $id, name: $name, description: $description }) {
          id
          name
          description
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      id,
      name,
      description: description || null, // Allow description to be optional
    };

    console.log("Executing GraphQL mutation:", CREATE_ROLE_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(CREATE_ROLE_MUTATION, {
      variables,
    });

    const role = response.data?.role_insert;

    if (!role) {
      throw new Error("Failed to create role");
    }

    res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Role created successfully",
      data: role,
    });
  } catch (error) {
    console.error("Error creating role:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to create role",
      error: error.message,
    });
  }
};

module.exports = {
  createRole,
};