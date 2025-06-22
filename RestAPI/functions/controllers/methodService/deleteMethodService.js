const {dataConnect} = require("../../config/firebase.js");

const deleteOneMethodService = async (serviceId, methodId) => {
    try {
        if (!serviceId) {
            throw new Error("serviceId is required");
        }

        if (!methodId) {
            throw new Error("methodId is required");
        }

        const variables = { serviceId, methodId };
        const DELETE_METHOD_SERVICE_MUTATION = `
            mutation DeleteServiceMethod($serviceId: String!, $methodId: String!) @auth(level: USER) {
                serviceMethod_delete(key: {serviceId: $serviceId, methodId: $methodId})
            }
        `;

        const response = await dataConnect.executeGraphql(DELETE_METHOD_SERVICE_MUTATION, {
            variables: variables,
        });
        const responseData = response.data.serviceMethod_delete || {};
    } catch (error) {
        console.error("Error in deleteMethodService:", error);
        throw new Error("Failed to delete method from service");
    }
}

const deleteMethodServices = async (serviceId) => {
    try {
        if (!serviceId) {
            throw new Error("serviceId is required");
        }

        const variables = { 
            serviceId: serviceId 
        };

        const DELETE_ALL_METHODS_MUTATION = `
            mutation DeleteServiceMethodsByService($serviceId: String!) {
                serviceMethod_deleteMany(
                    where: {
                    serviceId: { eq: $serviceId }
                    }
                )
            }
        `;
        const response = await dataConnect.executeGraphql(DELETE_ALL_METHODS_MUTATION, {
            variables: variables,
        });
        const responseData = response.data;
        if (!responseData) {
            throw new Error("No methods found for the given serviceId");
        }

        return {
            statusCode: 200,
            status: "success",
            message: "All methods deleted successfully from the service",
        };
    } catch (error) {
        console.error("Error deleting method services:", error);
        throw new Error("Failed to delete method services");
    }
}

module.exports = {
    deleteOneMethodService,
    deleteMethodServices
};