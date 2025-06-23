const {dataConnect} = require("../../config/firebase.js");
const {checkServiceExists} = require("../services/serviceUtils.js");
const {checkMethodExists} = require("../methods/methodUtils.js");

const checkMethodServiceExists = async (serviceId, methodId) => {
    if (!serviceId) {
        throw new Error("serviceId is required");
    }

    if (!methodId) {
        throw new Error("methodId is required");
    }

    if (!(await checkServiceExists(serviceId))) {
        throw new Error("Service does not exist");
    }

    if (!(await checkMethodExists(methodId))) {
        throw new Error("Method does not exist");
    }

    const variables = { 
        serviceId, 
        methodId 
    };

    const GET_METHOD_SERVICE_QUERY = `
        query GetServiceMethod($serviceId: String!, $methodId: String!) @auth(level: USER) {
        serviceMethod(key: {serviceId: $serviceId, methodId: $methodId}) {
            serviceId
            methodId
            service {
            id
            title
            description
            price
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

    const response = await dataConnect.executeGraphql(GET_METHOD_SERVICE_QUERY, { 
        variables : variables
    });
    const responseData = response.data.serviceMethod;
    if (!responseData) {
        return false;
    } else return true;
}

const getServiceMethods = async (serviceId) => {
    try {
        if (!serviceId) {
            throw new Error("serviceId is required");
        }

        const GET_SERVICE_METHODS_QUERY = `
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

        const response = await dataConnect.executeGraphql(GET_SERVICE_METHODS_QUERY, { 
            variables: { serviceId } 
        });
        const responseData = response.data.serviceMethods;
        if (!responseData || responseData.length === 0) {
            throw new Error("No methods found for this service");
        }
        return responseData;
    } catch (Error) {
        console.error("Error fetching service methods:", Error);
        throw Error;
    }
}


module.exports = {
    checkMethodServiceExists,
    getServiceMethods,
};
