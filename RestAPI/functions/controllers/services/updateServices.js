const { dataConnect } = require("../../config/firebase.js");

const updateDnaService = async (req, res) => {
  try {
    const { 
      serviceId, 
      title, 
      description, 
      fullDescription, 
      price, 
      duration, 
      category, 
      serviceType, 
      hasLegalValue, 
      icon, 
      participants, 
      requiredDocuments, 
      procedures, 
      featured 
    } = req.body;

    // Validate input
    if (!serviceId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Service ID is required",
      });
    }

    const UPDATE_DNA_SERVICE_MUTATION = `
      mutation UpdateDnaService($serviceId: String!, $title: String, $description: String, $fullDescription: String, $price: String, $duration: String, $category: String, $serviceType: String, $hasLegalValue: Boolean, $icon: String, $participants: String, $requiredDocuments: String, $procedures: String, $featured: Boolean) @auth(level: USER) {
        dnaService_update(key: { id: $serviceId }, data: { title: $title, description: $description, fullDescription: $fullDescription, price: $price, duration: $duration, category: $category, serviceType: $serviceType, hasLegalValue: $hasLegalValue, icon: $icon, participants: $participants, requiredDocuments: $requiredDocuments, procedures: $procedures, featured: $featured }) {
          id
          title
          description
          fullDescription
          price
          duration
          category
          serviceType
          hasLegalValue
          icon
          participants
          requiredDocuments
          procedures
          featured
        }
      }
    `;

    const variables = {
      serviceId,
      title: title || null,
      description: description || null,
      fullDescription: fullDescription || null,
      price: price || null,
      duration: duration || null,
      category: category || null,
      serviceType: serviceType || null,
      hasLegalValue: hasLegalValue !== undefined ? hasLegalValue : null,
      icon: icon || null,
      participants: participants || null,
      requiredDocuments: requiredDocuments || null,
      procedures: procedures || null,
      featured: featured !== undefined ? featured : null,
    };

    console.log("Executing GraphQL mutation:", UPDATE_DNA_SERVICE_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(UPDATE_DNA_SERVICE_MUTATION, {
      variables,
    });

    const dnaService = response.data?.dnaService_update;

    if (!dnaService) {
      throw new Error("Failed to update DNA service");
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "DNA service updated successfully",
      data: dnaService,
    });
  } catch (error) {
    console.error("Error updating DNA service:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to update DNA service",
      error: error.message,
    });
  }
};

module.exports = {
  updateDnaService,
};