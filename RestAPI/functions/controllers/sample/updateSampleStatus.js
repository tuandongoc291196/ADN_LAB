const { dataConnect } = require("../../config/firebase.js");

const updateSampleStatus = async (req, res) => {
  try {
    const { sampleId, status, staffId, collectionDate, notes } = req.body;

    // Validate input
    if (!sampleId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Sample ID is required",
      });
    }

     if (!status) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Sample status is required",
      });
    }

    const UPDATE_SAMPLE_STATUS_MUTATION = `
      mutation UpdateSampleStatus($sampleId: String!, $status: String!, $staffId: String, $collectionDate: Date, $notes: String) @auth(level: USER) {
        sample_update(key: { id: $sampleId }, data: { status: $status, staffId: $staffId, collectionDate: $collectionDate, notes: $notes }) {
          id
          status
          staffId
          collectionDate
          notes
        }
      }
    `;

    const variables = {
      sampleId,
      status,
      staffId: staffId || null,
      collectionDate: collectionDate || null,
      notes: notes || null,
    };

    console.log("Executing GraphQL mutation:", UPDATE_SAMPLE_STATUS_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(UPDATE_SAMPLE_STATUS_MUTATION, {
      variables,
    });

    const sample = response.data?.sample_update;

    if (!sample) {
      throw new Error("Failed to update sample status");
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Sample status updated successfully",
      data: sample,
    });
  } catch (error) {
    console.error("Error updating sample status:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to update sample status",
      error: error.message,
    });
  }
};

module.exports = {
  updateSampleStatus,
};