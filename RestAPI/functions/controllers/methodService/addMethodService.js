const {dataConnect} = require("../../config/firebase.js");
const {checkMethodServiceExists} = require("./getMethodServices.js");

const addServiceMethod = async (serviceId, methodId) => {
    try {
        if (!serviceId) {
            throw new Error("serviceId is required");
        }

        if (!methodId) {
            throw new Error("methodId is required");
        }

        const variables = {serviceId, methodId};
        const ADD_METHOD_SERVICE_MUTATION = `
            mutation CreateServiceMethod($serviceId: String!, $methodId: String!) @auth(level: USER) {
                serviceMethod_insert(data: {serviceId: $serviceId, methodId: $methodId})
            }
        `;

        const response = await dataConnect.executeGraphql(ADD_METHOD_SERVICE_MUTATION, {
            variables : variables,
        });
        const responseData = response.data.serviceMethod_insert || {};

    } catch (error) {
        console.error("Error in addServiceMethod:", error);
        throw new Error("Failed to add method to service");
    }
}

exports.addServiceMethod = addServiceMethod;