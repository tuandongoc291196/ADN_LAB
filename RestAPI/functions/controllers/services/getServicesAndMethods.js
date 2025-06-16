const { dataConnect } = require("../../config/firebase.js");

/**
 * @swagger
 * /services&methods:
 *   get:
 *     tags:
 *       - Services
 *     summary: Get all services and collection methods
 *     description: Retrieves all DNA services along with their available collection methods (requires authentication)
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Services and methods retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServicesResponse'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * Get all services with their collection methods
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
const getAllServiceAndMethods = async (req, res) => {
  try {
    const GET_SERVICES_AND_METHODS_QUERY = "query GetServicesWithCollectionMethods @auth(level: USER) { dnaServices(orderBy: {title: ASC}) { id title description fullDescription price duration category serviceType hasLegalValue icon participants requiredDocuments procedures featured createdAt updatedAt } serviceCollectionMethods { id serviceId methodId methodTitle methodDescription methodIcon methodColor methodNote methodProcess allowedFor createdAt } }";
    console.log("Executing GraphQL query:", GET_SERVICES_AND_METHODS_QUERY);
    const response = await dataConnect.executeGraphql(GET_SERVICES_AND_METHODS_QUERY);

    const responseData = response.data || [];

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

/**
 * @swagger
 * /services&methods:
 *   post:
 *     tags:
 *       - Services
 *     summary: Get a specific service with its collection methods
 *     description: Retrieves detailed information about a specific DNA service and its available collection methods (requires authentication)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceRequest'
 *           example:
 *             serviceId: "service_123"
 *     responses:
 *       200:
 *         description: Service and methods retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServicesResponse'
 *       400:
 *         description: Bad request - Service ID is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Internal server error
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */

/**
 * Get a specific service with its collection methods
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
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

    const variables = {
      serviceId: serviceId,
    };
    
    const GET_ONE_SERVICE_AND_METHODS_QUERY = "query GetDnaServiceWithMethods($serviceId: String!) @auth(level: USER) { dnaService(key: {id: $serviceId}) { id title description fullDescription price duration category serviceType hasLegalValue icon participants requiredDocuments procedures featured createdAt updatedAt } serviceCollectionMethods(where: {serviceId: {eq: $serviceId}}) { id methodId methodTitle methodDescription methodIcon methodColor methodNote methodProcess allowedFor createdAt } }";
    console.log("Executing GraphQL query:", GET_ONE_SERVICE_AND_METHODS_QUERY);
    const response = await dataConnect.executeGraphql(GET_ONE_SERVICE_AND_METHODS_QUERY, {
      variables: variables,
    });

    const responseData = response.data || [];

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

module.exports = {
  getAllServiceAndMethods,
  getOneServiceAndMethods,
};