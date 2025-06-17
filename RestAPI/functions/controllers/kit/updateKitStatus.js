const { dataConnect } = require("../../config/firebase.js");

const updateKitStatus = async (req, res) => {
  try {
    const { kitId, status } = req.body;

    // Validate input
    if (!kitId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Kit ID is required",
      });
    }

    if (!status) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Kit status is required",
      });
    }

    const UPDATE_KIT_STATUS_MUTATION = `
      mutation UpdateKitStatus($kitId: String!, $status: String!) @auth(level: USER) {
        kit_update(key: { id: $kitId }, data: { status: $status }) {
          id
          amount
          status
        }
      }
    `;

    const variables = {
      kitId,
      status,
    };

    console.log("Executing GraphQL mutation:", UPDATE_KIT_STATUS_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(UPDATE_KIT_STATUS_MUTATION, {
      variables,
    });

    const kit = response.data?.kit_update;

    if (!kit) {
      throw new Error("Failed to update kit status");
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Kit status updated successfully",
      data: kit,
    });
  } catch (error) {
    console.error("Error updating kit status:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to update kit status",
      error: error.message,
    });
  }
};

module.exports = {
  updateKitStatus,
};