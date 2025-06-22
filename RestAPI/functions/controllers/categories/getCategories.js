const { dataConnect } = require("../../config/firebase.js");

const checkCatergoryExists = async (categoryId) => {
    try {
        if (!categoryId) {
            throw new Error("categoryId is required");
        }

        const variables = { 
            categoryId: categoryId 
        };
        const GET_CATEGORY_QUERY = `
            query GetServiceCategoryById($categoryId: String!) @auth(level: USER) {
                serviceCategory(key: {id: $categoryId}) {
                    id
                    name
                    description
                    hasLegalValue
                    createdAt
                    updatedAt
                }
            }
        `;

        const response = await dataConnect.executeGraphql(GET_CATEGORY_QUERY, { 
            variables: variables 
        });
        const responseData = response.data.serviceCategory;

        if (!responseData) {
            return false;
        } else return true;
    } catch (error) {
        console.error("Error checking category existence:", error);
        throw new Error("Failed to check category existence");
    }
}

module.exports = {
    checkCatergoryExists,
};