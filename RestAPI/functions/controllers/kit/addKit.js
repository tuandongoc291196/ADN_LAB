const { dataConnect } = require("../../config/firebase.js");

const createKit = async (req, res) => {
  try {
    const { id, amount } = req.body;

    // Validate input
    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Kit ID is required",
      });
    }

     if (!amount) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Kit amount is required",
      });
    }

    const CREATE_KIT_MUTATION = `
      mutation CreateKit($id: String!, $amount: Int!) @auth(level: USER) {
        kit_insert(data: { id: $id, amount: $amount, status: "available" }) {
          id
          amount
          status
        }
      }
    `;

    const variables = {
      id,
      amount,
      status: "available",
    };

    console.log("Executing GraphQL mutation:", CREATE_KIT_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(CREATE_KIT_MUTATION, {
      variables,
    });

    const kit = response.data?.kit_insert;

    if (!kit) {
      throw new Error("Failed to create kit");
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Kit created successfully",
      data: kit,
    });
  } catch (error) {
    console.error("Error creating kit:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to create kit",
      error: error.message,
    });
  }
};

module.exports = {
  createKit,
};