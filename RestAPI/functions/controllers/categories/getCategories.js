const { dataConnect } = require("../../config/firebase.js");

const checkCatergoryExists = async (categoryId) => {
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

    console.log("Executing GraphQL query to check category existence:", GET_CATEGORY_QUERY, "with id:", categoryId);
    const response = await dataConnect.executeGraphql(GET_CATEGORY_QUERY, { 
        variables: variables 
    });
    const responseData = response.data.serviceCategory;

    if (!responseData) {
        return false;
    } else return true;
}

module.exports = {
    checkCatergoryExists,
};