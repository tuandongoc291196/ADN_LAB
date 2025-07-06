const { dataConnect } = require("../../config/firebase.js");

const checkUserExists = async (userId) => {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }

    const GET_ONE_USER_QUERY = `
      query GetUserById($userId: String!) @auth(level: USER) {
        user(key: {id: $userId}) {
          id
          fullname
          email
          accountStatus
          role {
            id
            name
          }
          createdAt
          lastLogin
        }
      }
    `;

    const variables = {
      userId: userId
    };
    console.log("Executing GraphQL query:", GET_ONE_USER_QUERY, "with variables:", variables);
    const response = await dataConnect.executeGraphql(GET_ONE_USER_QUERY, { 
      variables: variables 
    });
    
    response.data = response.data.user;
    if (!response.data) {
      console.log(`User with ID ${userId} does not exist`);
      return false;
    } else return true;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
};

const checkStaffExists = async (staffId, positionId) => {
  try {
    if (!staffId) {
      throw new Error("staffId is required");
    }

    if (!positionId) {
      throw new Error("positionId is required");
    }

    const GET_ONE_STAFF_QUERY = `
      query GetStaffByIdAndPosition($staffId: String!, $positionId: String!) @auth(level: USER) {
        staffs(where: {
          id: {eq: $staffId},
          positionId: {eq: $positionId}
        }) {
          id
          positionId
          user {
            id
            fullname
            email
          }
          position {
            id
            name
          }
        }
      }
    `;

    const variables = {
      staffId: staffId,
      positionId: positionId,
    };
    console.log("Executing GraphQL query:", GET_ONE_STAFF_QUERY, "with variables:", variables);
    const response = await dataConnect.executeGraphql(GET_ONE_STAFF_QUERY, {
      variables: variables
    }); 

    const responseData = response.data.staffs;
    if (!responseData || responseData.length === 0) {
      console.log(`Staff with ID ${staffId} and positionId ${positionId} does not exist`);
      return false;
    } else {
      console.log(`Staff with ID ${staffId} and positionId ${positionId} exists`);
      return true;
    }
  } catch (error) {
    console.error("Error checking staff existence:", error);
    throw error;
  }
};  

const countUsersByRole = async (roleId) => {
  try {
    if (!roleId) {
      throw new Error("roleId is required");
    }

    const COUNT_USERS_BY_ROLE_QUERY = `
      query CountUsersByRole($roleId: String!) @auth(level: USER) {
        users(where: {roleId: {eq: $roleId}}) {
          id
        }
      }
    `;

    const variables = { roleId };
    console.log("Executing GraphQL query:", COUNT_USERS_BY_ROLE_QUERY, "with variables:", variables);
    const response = await dataConnect.executeGraphql(COUNT_USERS_BY_ROLE_QUERY, { variables });
    
    const responseData = response.data?.users || [];
    const userCount = responseData.length;
    
    console.log(`Found ${userCount} users with roleId "${roleId}"`);
    return userCount;
  } catch (error) {
    console.error(`Error counting users with roleId ${roleId}:`, error);
    throw error;
  }
};

const countActiveUsersByRole = async (roleId) => {
  try {
    if (!roleId) {
      throw new Error("roleId is required");
    }

    const COUNT_USERS_BY_ROLE_QUERY = `
      query CountActiveUsersByRole($roleId: String!) @auth(level: USER) {
        users(where: {
          roleId: {eq: $roleId},
          accountStatus: {eq: "active"}
        }) {
          id
        }
      }
    `;

    const variables = { roleId };
    console.log("Executing GraphQL query:", COUNT_USERS_BY_ROLE_QUERY, "with variables:", variables);
    const response = await dataConnect.executeGraphql(COUNT_USERS_BY_ROLE_QUERY, { variables });
    
    const responseData = response.data?.users || [];
    const userCount = responseData.length;
    if (userCount === 0) {
      console.log(`No active users found with roleId "${roleId}"`);
      throw new Error(`No active users found with roleId "${roleId}"`);
    }
    console.log(`Found ${userCount} users with roleId "${roleId}"`);
    return userCount;
  } catch (error) {
    console.error(`Error counting users with roleId ${roleId}:`, error);
    throw error;
  }
};

const getActiveStaffWithLowestSlotCount = async (positionId) => {
  try {
    if (!positionId) {
      throw new Error("positionId is required");
    }
    const GET_STAFF_WITH_LOWEST_SLOT_COUNT_QUERY = `
      query GetStaffWithLowestSlot($positionId: String!) @auth(level: USER) {
        staffs(where: {
          positionId: {eq: $positionId},
          user: {accountStatus: {eq: "active"}}
        }, orderBy: {slot: ASC}, limit: 1) {
          id
          slot
          user {
            id
            fullname
            email
            phone
          }
        }
      }
    `;

    const variables = { 
      positionId: positionId 
    };
    console.log("Executing GraphQL query:", GET_STAFF_WITH_LOWEST_SLOT_COUNT_QUERY, "with variables:", variables);
    const response = await dataConnect.executeGraphql(GET_STAFF_WITH_LOWEST_SLOT_COUNT_QUERY, {
      variables: variables
    });

    const staff = response.data.staffs?.[0];
    
    if (!staff) {
      console.log("No staff members found with roleId " + positionId);
      throw new Error("No staff members found with the specified positionId");
    }
    console.log(`Found staff with lowest slot count: ${staff.fullname} (ID: ${staff.id}) with ${staff.dailySlotCount} slots`);
    return staff.id;
  } catch (error) {
    console.error("Error getting staff with lowest slot count:", error);
    throw error;
  }
};

const getActiveStaffWithLowestSlotCountExcluding = async (positionId, excludeStaffId) => {
  try {
    if (!positionId) {
      throw new Error("positionId is required");
    }

    if (!excludeStaffId) {
      throw new Error("excludeStaffId is required");
    }

    const GET_ACTIVE_STAFF_EXCLUDING_QUERY = `
      query GetActiveStaffExcluding($positionId: String!, $excludeStaffId: String!) @auth(level: USER) {
        staffs(
          where: {
            positionId: {eq: $positionId},
            id: {ne: $excludeStaffId},
            user: {
              accountStatus: {eq: "active"}
            }
          },
          orderBy: {slot: ASC},
          limit: 1
        ) {
          id
          slot
          user {
            id
            fullname
            accountStatus
          }
        }
      }
    `;

    const variables = {
      positionId: positionId,
      excludeStaffId: excludeStaffId
    };

    console.log("Executing GraphQL query:", GET_ACTIVE_STAFF_EXCLUDING_QUERY, "with variables:", variables);
    const response = await dataConnect.executeGraphql(GET_ACTIVE_STAFF_EXCLUDING_QUERY, {
      variables: variables,
    });

    const responseData = response.data.staffs;

    if (!responseData || responseData.length === 0) {
      console.log(`No alternative active staff found for position ${positionId} excluding staff ${excludeStaffId}`);
      throw new Error(`No alternative active staff found for position ${positionId} excluding staff ${excludeStaffId}`);
    }

    console.log(`Found alternative staff: ${responseData[0].id} with ${responseData[0].slot} slots`);
    return responseData[0].id;

  } catch (error) {
    console.error("Error getting alternative active staff:", error);
    throw error;
  }
};

module.exports = {
  checkUserExists,
  checkStaffExists,
  countUsersByRole,
  getActiveStaffWithLowestSlotCount,
  getActiveStaffWithLowestSlotCountExcluding,
  countActiveUsersByRole
};
