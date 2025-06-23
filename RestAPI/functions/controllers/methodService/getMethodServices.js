const {dataConnect} = require("../../config/firebase.js");
const {checkServiceExists} = require("../services/serviceUtils.js");
const {checkMethodExists} = require("../methods/methodUtils.js");

const getMethodServices = async (req, res) => {
    try {
        const {serviceId} = req.body;
        
        if (!serviceId) {
            return res.status(400).json({
                statusCode: 400,
                status: "Error",
                message: "serviceId is required",
            });
        }

        if (!(await checkServiceExists(serviceId))) {
            return res.status(404).json({
                statusCode: 404,
                status: "Error",
                message: "Service does not exist",
            });
        }

        const GET_METHOD_SERVICES_QUERY = `
            query GetServiceMethods($serviceId: String!) @auth(level: USER) {
                serviceMethods(where: {serviceId: {eq: $serviceId}}) {
                    serviceId
                    methodId
                    service {
                    id
                    title
                    }
                    method {
                    id
                    name
                    description
                    price
                    }
                    createdAt
                    updatedAt
                }
            }
        `;
        const variables = { 
            serviceId : serviceId 
        };
        const response = await dataConnect.executeGraphql(GET_METHOD_SERVICES_QUERY, { 
            variables: variables 
        });
        const responseData = response.data.serviceMethods;

        if (!responseData || responseData.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                status: "Error",
                message: "No methods found for this service",
            });
        }

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Methods retrieved successfully",
            data: responseData,
        });
    } catch (Error) {
        console.log("Error fetching method services:", Error);
        res.status(500).json({
            statusCode: 500,
            status: "Error",
            message: "Failed to retrieve method services",
            Error: Error.message,
        });
    }
}

const getServicesByMethodId = async (req, res) => {
    
    try {
        const { methodId } = req.body;
        if (!methodId) {
            return res.status(400).json({
                statusCode: 400,
                status: "Error",
                message: "methodId is required",
            });
        }

        if (!(await checkMethodExists(methodId))) {
            return res.status(404).json({
                statusCode: 404,
                status: "Error",
                message: "Method does not exist",
            });
        }

        const GET_SERVICES_BY_METHOD_QUERY = `
            query GetServicesByMethodId($methodId: String!) {
                serviceMethods(where: { methodId: { eq: $methodId } }) {
                    service {
                    id
                    title
                    description
                    price
                    duration
                    }
                }
            }
        `;
        const variables = { 
            methodId: methodId 
        };

        const response = await dataConnect.executeGraphql(GET_SERVICES_BY_METHOD_QUERY, { 
            variables: variables
        });

        const responseData = response.data.serviceMethods;
        if (!responseData || responseData.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                status: "Error",
                message: "No services found for this method",
            });
        }
        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Services retrieved successfully",
            data: responseData,
        });
    } catch (Error) {
        console.error("Error fetching services by method ID:", Error);
        throw Error;
    }
}
module.exports = {
    getMethodServices,
    getServicesByMethodId,
};
    