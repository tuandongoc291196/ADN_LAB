const { dataConnect } = require("../../config/firebase.js");

const addRole = async (req, res) => {
  try {
    const { id, name, description } = req.body;

    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "id is required",
      });
    }

    if (!name) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "name is required",
      });
    }

    if (!description) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "description is required",
      });
    }

    const CREATE_ROLE_MUTATION = `
      mutation CreateRole($id: String!, $name: String!, $description: String) @auth(level: USER) {
        role_insert(data: {id: $id, name: $name, description: $description})
      }
    `;

    const variables = {
      id: id,
      name: name,
      description: description
    };

    console.log("Executing GraphQL mutation:", CREATE_ROLE_MUTATION, "with variables:", variables);
    const response = await dataConnect.executeGraphql(CREATE_ROLE_MUTATION, {
      variables : variables,
    });

    const responseData = response.data;
    console.log("Response data:", responseData);
    
    res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Role created successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error creating role:", error);
    if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
      return res.status(409).json({
        statusCode: 409,
        status: "error",
        message: "Role with this ID already exists",
        error: error.message,
      });
    }

    if (error.codePrefix === 'data-connect' && error.errorInfo) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Database operation failed",
        error: error.message,
      });
    }

    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to create role",
      error: error.message,
    });
  }
};

module.exports = {
  addRole,
};