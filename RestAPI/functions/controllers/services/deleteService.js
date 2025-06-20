const { dataConnect } = require("../../config/firebase.js");
const {checkServiceExists} = require('./getServicesAndMethods.js');

const deleteServiceMethods = async (serviceId) => {
  try {
    const DELETE_SERVICE_METHODS = `
      mutation DeleteServiceCollectionMethods($serviceId: String!) @auth(level: USER) {
        serviceCollectionMethod_deleteMany(where: {serviceId: {eq: $serviceId}})
      }
    `;

    const variables = {
      serviceId: serviceId,
    };

    console.log("Deleting service methods for serviceId:", serviceId);
    const response = await dataConnect.executeGraphql(DELETE_SERVICE_METHODS, {
      variables: variables,
    });
    
    console.log("Service methods deleted successfully:", response.data);
    return response.data;
  } catch (error) {
    console.error("Error deleting service methods:", error);
    throw error;
  }
};

const deleteService = async (req, res) => {
  try {
    const {serviceId} = req.body;

    if (!serviceId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "serviceId is required",
      });
    }

    console.log("Checking if service exists before deletion, serviceId:", serviceId);
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

    await deleteServiceMethods(serviceId);
    const DELETE_DNA_SERVICE_MUTATION = `
      mutation DeleteDnaService($serviceId: String!) @auth(level: USER) {
        dnaService_delete(key: {id: $serviceId})
      }
    `;

    const variables = {
      serviceId: serviceId,
    };

    console.log("Executing GraphQL mutation:", DELETE_DNA_SERVICE_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(DELETE_DNA_SERVICE_MUTATION, {
      variables,
    });

    const responseData = response.data;
    console.log("Response data:", responseData);

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Service and its methods deleted successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error deleting service:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to delete service",
      error: error.message,
    });
  }
};

module.exports = {
  deleteService,
  deleteServiceMethods,
};