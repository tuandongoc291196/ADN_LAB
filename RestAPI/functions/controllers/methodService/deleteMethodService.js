const {dataConnect} = require("../../config/firebase.js");
const {checkMethodServiceExists} = require("./getMethodServices.js");

const deleteMethodService = async (serviceId, methodId) => {
    try {
        if (!serviceId) {
            throw new Error("serviceId is required");
        }

        if (!methodId) {
            throw new Error("methodId is required");
        }

        if (!(await checkMethodServiceExists(serviceId, methodId))) {
            throw new Error("Method does not exist for this service");
        }

        const variables = { serviceId, methodId };
        const DELETE_METHOD_SERVICE_MUTATION = `
            mutation DeleteServiceMethod($serviceId: String!, $methodId: String!) @auth(level: USER) {
                serviceMethod_delete(key: {serviceId: $serviceId, methodId: $methodId})
            }
        `;

        console.log("Executing GraphQL mutation:", DELETE_METHOD_SERVICE_MUTATION, "with variables:", variables);
        const response = await dataConnect.executeGraphql(DELETE_METHOD_SERVICE_MUTATION, {
            variables: variables,
        });
        const responseData = response.data.serviceMethod_delete || {};
        
        console.log("Response data:", responseData);
    } catch (error) {
        console.error("Error in deleteMethodService:", error);
        throw new Error("Failed to delete method from service");
    }
}

module.exports = {
    deleteMethodService,
};