const { dataConnect } = require("../../config/firebase.js");

const createSample = async (req, res) => {
  try {
    const { id, bookingId, serviceId, staffId, collectionDate, notes } = req.body;

    // Validate input
    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Sample ID is required",
      });
    }

    if (!bookingId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Booking ID is required",
      });
    }

    if (!serviceId) { 
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Service ID is required",
      });
    }

    const CREATE_SAMPLE_MUTATION = `
      mutation CreateSample($id: String!, $bookingId: String!, $serviceId: String!, $staffId: String, $collectionDate: Date, $notes: String) @auth(level: USER) {
        sample_insert(data: { id: $id, bookingId: $bookingId, serviceId: $serviceId, staffId: $staffId, collectionDate: $collectionDate, notes: $notes, status: "pending" }) {
          id
          bookingId
          serviceId
          staffId
          collectionDate
          notes
          status
        }
      }
    `;

    const variables = {
      id,
      bookingId,
      serviceId,
      staffId: staffId || null,
      collectionDate: collectionDate || null,
      notes: notes || null,
    };

    console.log("Executing GraphQL mutation:", CREATE_SAMPLE_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(CREATE_SAMPLE_MUTATION, {
      variables,
    });

    const sample = response.data?.sample_insert;

    if (!sample) {
      throw new Error("Failed to create sample");
    }

    res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Sample created successfully",
      data: sample,
    });
  } catch (error) {
    console.error("Error creating sample:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to create sample",
      error: error.message,
    });
  }
};

module.exports = {
  createSample,
};