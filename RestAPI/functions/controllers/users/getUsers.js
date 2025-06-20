const { dataConnect } = require("../../config/firebase.js");

const getAllUsers = async (req, res) => {
  try {
    const variables = {
      "limit": 20,
      "offset": 0
    };
    
    const GET_USERS_QUERY = "query GetUsers($limit: Int, $offset: Int) @auth(level: USER) { users(limit: $limit, offset: $offset, orderBy: { createdAt: DESC }) { id fullname email accountStatus role { id name } createdAt lastLogin } }";
    console.log("Executing GraphQL query:", GET_USERS_QUERY, "with variables:", variables);
    const response = await dataConnect.executeGraphql(GET_USERS_QUERY, {
      variables: variables,
    });

    const responseData = response.data || [];

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Users retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching users:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve users",
      error: error.message,
    });
  }
};

const getOneUser = async (req, res) => {
  try {
    const {userId} = req.body;
    
    if (!userId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "userId is required",
      });
    }

    console.log("Checking if user exists before update, userId:", userId);
    const existingUser = await checkUserExists(userId);
    console.log("User existence check result:", existingUser);
    if (!existingUser) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "User not found",
        error: "User with the provided ID does not exist",
      });
    }
    
    const variables = {
      userId: userId,
    };
    
    const GET_ONE_USER = "query GetUserById($userId: String!) @auth(level: USER) { user(key: {id: $userId}) { id fullname gender avatar email accountStatus authProvider phone shippingAddress roleId role { id name description } dailySlotCount maxDailySlots createdAt lastLogin } }";
    console.log("Executing GraphQL query:", GET_ONE_USER);
    const response = await dataConnect.executeGraphql(GET_ONE_USER, {
        variables: variables,});

    const responseData = response.data || [];

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "User retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve user",
      error: error.message,
    });
  }
};

const checkUserExists = async (userId) => {
  try {
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

    const variables = {userId};
    console.log("Executing GraphQL query:", GET_ONE_USER_QUERY, "with variables:", variables);
    const response = await dataConnect.executeGraphql(GET_ONE_USER_QUERY, { variables });
    
    return response.data?.user || null;
  } catch (error) {
    console.error("Error checking user existence:", error);
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

const getStaffWithLowestSlotCount = async () => {
  try {
    const GET_STAFF_WITH_LOWEST_SLOT_COUNT_QUERY = `
      query GetStaffWithLowestSlotCount @auth(level: USER) {
        users(
          where: {roleId: {eq: "1"}}
          orderBy: {dailySlotCount: ASC}
          limit: 1
        ) {
          id
          fullname
          email
          dailySlotCount
          maxDailySlots
          role {
            id
            name
          }
        }
      }
    `;

    console.log("Executing GraphQL query:", GET_STAFF_WITH_LOWEST_SLOT_COUNT_QUERY);
    const response = await dataConnect.executeGraphql(GET_STAFF_WITH_LOWEST_SLOT_COUNT_QUERY);

    const staff = response.data.users?.[0];
    
    if (!staff) {
      console.log("No staff members found with roleId '1'");
      return null;
    }

    console.log(`Found staff with lowest slot count: ${staff.fullname} (ID: ${staff.id}) with ${staff.dailySlotCount} slots`);
    return staff.id;
  } catch (error) {
    console.error("Error getting staff with lowest slot count:", error);
    throw error;
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  checkUserExists,
  countUsersByRole,
  getStaffWithLowestSlotCount
};
