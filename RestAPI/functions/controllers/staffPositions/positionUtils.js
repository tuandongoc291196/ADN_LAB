const { dataConnect } = require("../../config/firebase.js");

const checkPositionExists = async (positionId) => {
  try {
    if (!positionId) {
      throw new Error("positionId is required");
    }

    const GET_POSITION_QUERY = `
      query GetPositionById($positionId: String!) @auth(level: USER) {
        position(key: {id: $positionId}) {
            id
            name
            description
            createdAt
            updatedAt
        }
    }
    `;

    const variables = {
      positionId: positionId,
    };

    const response = await dataConnect.executeGraphql(GET_POSITION_QUERY, {
      variables: variables,
    });

    const responseData = response.data.position;
    if (!responseData) {
        return false;
    } else return true;
  } catch (error) {
    console.error("Error retrieving position:", error);
    throw error;
  }
}

module.exports = {
  checkPositionExists,
};
