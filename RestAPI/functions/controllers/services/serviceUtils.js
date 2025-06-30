const { dataConnect } = require("../../config/firebase.js");

const checkServiceExists = async (serviceId) => {
    try {
        if (!serviceId) {
            throw new Error("serviceId is required");
        }

        const variables = { serviceId: serviceId };
        const GET_SERVICE_QUERY = `
            query GetServiceById($serviceId: String!) @auth(level: USER) {
                service(key: {id: $serviceId}) {
                    id
                    title
                    description
                    fullDescription
                    price
                    duration
                    categoryId
                    category {
                    id
                    name
                    description
                    hasLegalValue
                    }
                    icon
                    featured
                    isActive
                    createdAt
                    updatedAt
                }
            }
      `;

        const response = await dataConnect.executeGraphql(GET_SERVICE_QUERY, { 
            variables: variables 
        });
        const responseData = response.data.service;
        if (!responseData) {
            return false;
        } else return true;
    } catch (error) {
        console.error("Error checking service existence:", error);
        throw new Error("Failed to check service existence");
    }
};

module.exports = {
    checkServiceExists
};