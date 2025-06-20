const { dataConnect } = require("../../config/firebase.js");
const {checkServiceExists} = require('./getServicesAndMethods.js');
const {addServiceMethods} = require('./addService.js');
const {deleteServiceMethods} = require('./deleteService.js');

const updateService = async (req, res) => {
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
      serviceMethods, 
      featured 
    } = req.body;

    if (!serviceId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Service ID is required",
      });
    }

    if (!title) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "title is required",
      });
    }

    if (!description) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "description is required",
      });
    }

    if (!price) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "price is required",
      });
    }

    if (!duration) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "duration is required",
      });
    }

    if (!category) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "category is required",
      });
    }

    if (!serviceType) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "serviceType is required",
      });
    }

    if (hasLegalValue === undefined || hasLegalValue === null) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "hasLegalValue is required",
      });
    }

    if (!serviceMethods || !Array.isArray(serviceMethods) || serviceMethods.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "serviceMethods is required and must be a non-empty array",
      });
    }

    console.log("Checking if service exists before update, serviceId:", serviceId);
    const existingService = await checkServiceExists(serviceId);
    console.log("Service existence check result:", existingService);
    if (!existingService) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Service not found",
        error: "Service with the provided ID does not exist",
      });
    }

    const UPDATE_DNA_SERVICE_MUTATION = `
      mutation UpdateDnaService($serviceId: String!, $title: String, $description: String, $fullDescription: String, $price: String, $duration: String, $category: String, $serviceType: String, $hasLegalValue: Boolean, $icon: String, $participants: String, $requiredDocuments: String, $procedures: String, $featured: Boolean) @auth(level: USER) {
        dnaService_update(key: {id: $serviceId}, data: {title: $title, description: $description, fullDescription: $fullDescription, price: $price, duration: $duration, category: $category, serviceType: $serviceType, hasLegalValue: $hasLegalValue, icon: $icon, participants: $participants, requiredDocuments: $requiredDocuments, procedures: $procedures, featured: $featured})
      }
    `;

    const variables = {
      serviceId,
      title: title || "",
      description: description || "",
      fullDescription: fullDescription || "",
      price: price || "",
      duration: duration || "",
      category: category || "",
      serviceType: serviceType || "",
      hasLegalValue: hasLegalValue !== undefined ? hasLegalValue : null,
      icon: icon || "",
      participants: participants || "",
      requiredDocuments: requiredDocuments || "",
      procedures: procedures || "",
      featured: featured !== undefined ? featured : null,
    };

    console.log("Executing GraphQL mutation:", UPDATE_DNA_SERVICE_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(UPDATE_DNA_SERVICE_MUTATION, {
      variables,
    });
    const responseData = response.data;

    let responseMethodData = [];
    if (serviceMethods && Array.isArray(serviceMethods) && serviceMethods.length > 0) {
      console.log("Updating service methods for serviceId:", serviceId);
      await deleteServiceMethods(serviceId);
      responseMethodData = await addServiceMethods(serviceId, serviceMethods);
      console.log("Service methods updated successfully");
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "DNA service updated successfully",
      data: {
        service: responseData,
        methods: responseMethodData
      },
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
  updateService,
};