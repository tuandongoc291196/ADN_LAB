const { dataConnect } = require("../../config/firebase.js");

const checkStaffExists = async (staffId) => {
  try {

    if (!staffId) {
      throw new Error("staffId is required");
    }
    
    const CHECK_STAFF_EXISTS_QUERY = `
      query GetStaffById($staffId: String!) @auth(level: USER) {
        staff(key: {id: $staffId}) {
            id
            user {
            id
            fullname
            gender
            avatar
            email
            phone
            address
            accountStatus
            }
            hireDate
            slot
            specification
            certifications
            positionId
            position {
            id
            name
            description
            }
            createdAt
            updatedAt
        }
      }
    `;

    const variables = {
      staffId: staffId 
    };
    const response = await dataConnect.executeGraphql(CHECK_STAFF_EXISTS_QUERY, { 
      variables: variables 
    });
    const responseData = response.data.staff;
    if (!responseData) {
      console.log(`Staff with ID ${staffId} does not exist`);
      return false;
    } else {
      return true;
    }
  } catch (error) {
    console.error("Error checking staff existence:", error);
    throw error;
  }
}

const restStaffSlotByPosition = async (positionId) => {
  try {
    if (!positionId) {
      throw new Error("positionId is required");
    }

    const GET_STAFF_SLOT_QUERY = `
      mutation UpdateStaff($positionId: String) @auth(level: USER) {
        staff_updateMany(where: {positionId: {eq: $positionId}}, data: {slot: 0, updatedAt_expr: "request.time"})
      }
    `;

    const variables = { 
      positionId: positionId 
    };

    console.log("Updating staff slots for position ID:", positionId, "with variables:", variables);
    const response = await dataConnect.executeGraphql(GET_STAFF_SLOT_QUERY, { 
      variables: variables 
    });
    
    return response.data.staff_updateMany;
  } catch (error) {
    console.error("Error fetching staff slots by position:", error);
    throw error;
  }
}

module.exports = {
    checkStaffExists,
    restStaffSlotByPosition
};