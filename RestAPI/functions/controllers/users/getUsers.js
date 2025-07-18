const { dataConnect } = require("../../config/firebase.js");
const { checkUserExists} = require("./userUtils.js");
const { checkRoleExists } = require("../roles/roleUtils.js");

const getAllUsers = async (req, res) => {
  try {
    const GET_USERS_QUERY = `
      query GetUsers @auth(level: USER) { 
        users(orderBy: { createdAt: DESC }) {
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
          bookings_on_user {
            payments_on_booking {
              paymentMethod
              status
            }
            id
            totalAmount
            timeSlotId
          }
        } 
      }
    `;
    console.log("Executing GraphQL query:", GET_USERS_QUERY);
    const response = await dataConnect.executeGraphql(GET_USERS_QUERY);

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

    if (!(await checkUserExists(userId))) {
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
    
    const GET_ONE_USER = `
        query GetUserById($userId: String!) @auth(level: USER) {
      user(key: {id: $userId}) {
        id
        fullname
        gender
        avatar
        email
        accountStatus
        authProvider
        phone
        address
        roleId
        role {
          id
          name
          description
        }
        createdAt
        lastLogin
      }
    }
    `;
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

const getUsersByRole = async (req, res) => {
  try {
    const { roleId } = req.body;
    if (!roleId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "roleId is required",
      });
    }

    if (!(await checkRoleExists(roleId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Role not found",
        error: "Role with the provided ID does not exist",
      });
    }

    const variables = {
      roleId: roleId,
    };

    const GET_USERS_BY_ROLE_QUERY = `
      query GetUsersByRole($roleId: String!) @auth(level: USER) {
        users(where: {roleId: {eq: $roleId}}) {
          id
          fullname
          gender
          avatar
          email
          accountStatus
          role {
            name
          }
          createdAt
        }
      }
    `;

    console.log("Executing GraphQL query:", GET_USERS_BY_ROLE_QUERY, "with variables:", variables);
    const response = await dataConnect.executeGraphql(GET_USERS_BY_ROLE_QUERY, {
      variables: variables,
    });
    const responseData = response.data.users;
    console.log(responseData);
    if (!responseData || responseData.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "No users found for the specified role",
      });
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Users retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching users by role:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve users by role",
      error: error.message,
    });
  }
};

module.exports = {
  getAllUsers,
  getOneUser,
  getUsersByRole
};
