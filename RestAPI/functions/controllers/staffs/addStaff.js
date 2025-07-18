const { dataConnect } = require("../../config/firebase.js"); 

const addStaff = async (userId, positionId) => {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }
    if (!positionId) {
      throw new Error("roleId is required");
    }

    const ADD_USER_TO_TABLES = `
      mutation AddMinimalStaffMember($id: String!, $positionId: String!, $hireDate: Date!) @auth(level: USER) {
        staff_insert(data: {id: $id, positionId: $positionId, hireDate: $hireDate})
      }
    `;

    const variables = {
      id: userId,
      positionId: positionId,
      hireDate: new Date().toISOString().split('T')[0],
    };

    const response = await dataConnect.executeGraphql(ADD_USER_TO_TABLES, {
      variables: variables,
    });

    const responseData = response.data.staff_insert;
    if (!responseData) {
      return null;
    } else return responseData; 
  } catch (error) {
    console.error("Error retrieving user:", error);
    throw error;
  }
}

module.exports = {
  addStaff,
};
