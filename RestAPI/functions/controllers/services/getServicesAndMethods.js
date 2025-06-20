const { dataConnect } = require("../../config/firebase.js");
const getAllServiceAndMethods = async (req, res) => {
  try {
    const GET_SERVICES_AND_METHODS_QUERY = "query GetServicesWithCollectionMethods @auth(level: USER) { dnaServices(orderBy: {title: ASC}) { id title description fullDescription price duration category serviceType hasLegalValue icon participants requiredDocuments procedures featured createdAt updatedAt } serviceCollectionMethods { id serviceId methodId methodTitle methodDescription methodIcon methodColor methodNote methodProcess allowedFor createdAt } }";
    console.log("Executing GraphQL query:", GET_SERVICES_AND_METHODS_QUERY);
    const response = await dataConnect.executeGraphql(GET_SERVICES_AND_METHODS_QUERY);

    const responseData = response.data;

    if (responseData.role === null) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "There are no services in the database",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Services and methods retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching services and methods:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve services and methods",
      error: error.message,
    });
  }
};

const getOneServiceAndMethods = async (req, res) => {
  try {
    const {serviceId} = req.body;

    if (!serviceId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "serviceId is required",
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

    const variables = {
      serviceId: serviceId,
    };
    
    const GET_ONE_SERVICE_AND_METHODS_QUERY = "query GetDnaServiceWithMethods($serviceId: String!) @auth(level: USER) { dnaService(key: {id: $serviceId}) { id title description fullDescription price duration category serviceType hasLegalValue icon participants requiredDocuments procedures featured createdAt updatedAt } serviceCollectionMethods(where: {serviceId: {eq: $serviceId}}) { id methodId methodTitle methodDescription methodIcon methodColor methodNote methodProcess allowedFor createdAt } }";
    console.log("Executing GraphQL query:", GET_ONE_SERVICE_AND_METHODS_QUERY);
    const response = await dataConnect.executeGraphql(GET_ONE_SERVICE_AND_METHODS_QUERY, {
      variables: variables,
    });

    const responseData = response.data;

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Service and its methods retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching service and its methods:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve service and its methods",
      error: error.message,
    });
  }
};

const checkServiceExists = async (serviceId) => {
  try {
    const GET_ONE_SERVICE_QUERY = `
      query GetServiceById($serviceId: String!) @auth(level: USER) {
        dnaService(key: {id: $serviceId}) {
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
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      serviceId: serviceId,
    };

    const response = await dataConnect.executeGraphql(GET_ONE_SERVICE_QUERY, {
      variables: variables,
    }); 
    
    const responseData = response.data;
    return responseData.dnaService;
  } catch (error) {
    console.error("Error checking if service exists:", error);
    throw error;
  }
};

module.exports = {
  getAllServiceAndMethods,
  getOneServiceAndMethods,
  checkServiceExists
};