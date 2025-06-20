const { dataConnect } = require("../../config/firebase.js");
const { checkUserExists } = require('./getUsers.js');

const updateUserRole = async (req, res) => {
  try {
    const { userId, roleId } = req.body;

    if (!userId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "userId is required",
      });
    }
    if (!roleId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "roleId is required",
      });
    }

    console.log("Checking if user exists before updating role, userId:", userId);
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

    const UPDATE_USER_ROLE_MUTATION = `
        mutation UpdateUserRole($userId: String!, $roleId: String!) @auth(level: USER) {
            user_update(key: {id: $userId}, data: {roleId: $roleId})
            }
    `;

    const variables = {
      userId: userId,
      roleId: roleId,
    };

    console.log("Executing GraphQL mutation to update user role:", UPDATE_USER_ROLE_MUTATION);
    const response = await dataConnect.executeGraphql(UPDATE_USER_ROLE_MUTATION, {
      variables: variables,
    });

    const responseData = response.data || [];

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "User role updated successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    
    if (error.message && error.message.includes('violates foreign key constraint "user_role_id_fkey"')) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "The specified role does not exist. Please provide a valid roleId",
        error: error.message,
      });
    }

    if (error.message && error.message.includes('violates foreign key constraint')) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Database constraint violation",
        error: error,
      });
    }

    if (error.message && error.message.includes('SQL query error')) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Database operation failed",
        error: "There was an issue with the database operation. Please check your data and try again.",
      });
    }

    if (error.codePrefix === 'data-connect' && error.errorInfo) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Database operation failed",
        error: error.message,
      });
    }

    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to update user role",
      error: error.message,
    });
  }
}

const updateUser = async (req, res) => {
  try {
    const { 
      userId,
      fullname,
      gender,
      avatar,
      phone,
      shippingAddress
    } = req.body;

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

    if (!fullname) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "fullname is required",
      });
    }

    if (!gender) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "gender is required",
      });
    }

    if (!avatar) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "avatar is required",
      });
    }

    if (!phone) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "phone is required",
      });
    }

    if (!shippingAddress) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "shippingAddress is required",
      });
    }

    const UPDATE_USER_MUTATION = `
      mutation UpdateUser($userId: String!, $fullname: String, $gender: String, $avatar: String, $phone: String, $shippingAddress: String) @auth(level: USER) {
        user_update(key: {id: $userId}, data: {
          fullname: $fullname,
          gender: $gender,
          avatar: $avatar,
          phone: $phone,
          shippingAddress: $shippingAddress
        })
      }
    `;

    const variables = {
      userId,
      fullname: fullname || "",
      gender: gender || "",
      avatar: avatar || "",
      phone: phone || "",
      shippingAddress: shippingAddress || "",
    };

    console.log("Executing GraphQL mutation:", UPDATE_USER_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(UPDATE_USER_MUTATION, {
      variables,
    });

    const responseData = response.data;

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "User updated successfully",
      data: responseData,
    });

  } catch (error) {
    console.error("Error updating user:", error);
    if (error.message && error.message.includes('SQL query error')) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Database operation failed",
        error: "There was an issue with the database operation. Please check your data and try again.",
      });
    }

    if (error.codePrefix === 'data-connect' && error.errorInfo) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Database operation failed",
        error: error.message,
      });
    }

    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to update user",
      error: error.message,
    });
  }
};

const updateStaffSlotCount = async (userId, operation) => {
  try {
    if (!userId) {
      throw new Error("User ID is required");
    }

    if (!operation || (operation !== 'increase' && operation !== 'decrease')) {
      throw new Error("Operation must be 'increase' or 'decrease'");
    }

    console.log("Checking if user exists before updating role, userId:", userId);
    const existingUser = await checkUserExists(userId);
    console.log("User existence check result:", existingUser);
    if (!existingUser) {
      throw new Error("User not found");
    }
    
    const GET_USER_QUERY = `
      query GetUser($id: String!) @auth(level: USER) {
        user(key: { id: $id }) {
          id
          dailySlotCount
          maxDailySlots
        }
      }
    `;

    const getResponse = await dataConnect.executeGraphql(GET_USER_QUERY, {
      variables: { id: userId },
    });

    if (!getResponse.data?.user) {
      throw new Error("User not found");
    }

    const currentSlotCount = getResponse.data.user.dailySlotCount || 0;
    const maxDailySlots = getResponse.data.user.maxDailySlots || 4;
    const isIncrease = operation === 'increase';
    
    let newSlotCount;
    if (isIncrease) {
      newSlotCount = Math.min(currentSlotCount + 1, maxDailySlots);
    } else {
      newSlotCount = Math.max(0, currentSlotCount - 1);
    }

    const UPDATE_DAILY_SLOT_COUNT_MUTATION = `
      mutation UpdateDailySlotCount($userId: String!, $dailySlotCount: Int!) @auth(level: USER) {
        user_update(key: {id: $userId}, data: {dailySlotCount: $dailySlotCount})
      }
    `;

    const variables = {
      userId: userId,
      dailySlotCount: newSlotCount,
    };

    console.log("Executing GraphQL mutation:", UPDATE_DAILY_SLOT_COUNT_MUTATION, "with variables:", variables);
    const response = await dataConnect.executeGraphql(UPDATE_DAILY_SLOT_COUNT_MUTATION, {
      variables: variables,
    });

    return {
      success: true,
      data: response.data,
      message: `Daily slot count ${operation}d successfully`,
      previousSlotCount: currentSlotCount,
      newSlotCount: newSlotCount,
      maxDailySlots: maxDailySlots
    };
  } catch (error) {
    console.error(`Error ${operation}ing daily slot count:`, error);
    throw error;
  }
};


module.exports = {
  updateUserRole,
  updateUser,
  updateStaffSlotCount
};