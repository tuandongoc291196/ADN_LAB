const { dataConnect } = require("../../config/firebase.js");
const { checkUserExists } = require('./userUtils.js');
const {checkRoleExists} = require('../roles/roleUtils.js');
const { checkPositionExists } = require('../staffPositions/positionUtils.js');
const {addUserToStaff} = require('./addUser.js');

const updateUserRoleToStaff = async (req, res) => {
  try {
    const { userId, roleId} = req.body;

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

   if (!(await checkUserExists(userId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "User not found",
        error: "User with the provided ID does not exist",
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

    if (!(await checkPositionExists(roleId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Position not found",
        error: "Position with the provided ID does not exist",
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
    const responseRole = await dataConnect.executeGraphql(UPDATE_USER_ROLE_MUTATION, {
      variables: variables,
    });
    const responseDataRole = responseRole.data.user_update;

    const responseDataStaff = await addUserToStaff(userId, roleId);
    if (!responseDataStaff) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Failed to add user to staff",
        error: "There was an issue adding the user to staff. Please check your data and try again.",
      });
    }

    const responseData = {
      user: responseDataRole,
      staff: responseDataStaff,
    };

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

const updateUserRoleToAdmin = async (req, res) => {
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
    if (!(await checkUserExists(userId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "User not found",
        error: "User with the provided ID does not exist",
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
    const responseData = response.data.user_update;
    if (!responseData) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Failed to update user role to admin",
        error: "There was an issue updating the user role. Please check your data and try again.",
      });
    }
    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "User role updated to admin successfully",
      data: responseData,
    });

  } catch (error) {
    console.error("Error updating user role to admin:", error);
    
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
      message: "Failed to update user role to admin",
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
      address
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

    if (!address) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "address is required",
      });
    }

    const UPDATE_USER_MUTATION = `
      mutation UpdateUser($userId: String!, $fullname: String, $gender: String, $avatar: String, $phone: String, $address: String) @auth(level: USER) {
        user_update(key: {id: $userId}, data: {
          fullname: $fullname,
          gender: $gender,
          avatar: $avatar,
          phone: $phone,
          address: $address
        })
      }
    `;

    const variables = {
      userId,
      fullname: fullname || "",
      gender: gender || "",
      avatar: avatar || "",
      phone: phone || "",
      address: address || "",
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

const updateStaffSlotCount = async (staffId, operation) => {
  try {
    if (!staffId) {
      throw new Error("Staff ID is required");
    }

    if (!operation || (operation !== 'increase' && operation !== 'decrease')) {
      throw new Error("Operation must be 'increase' or 'decrease'");
    }
        
    const GET_STAFF_QUERY = `
      query GetStaff($staffId: String!) @auth(level: USER) {
        staff(key: { id: $staffId }) {
          id
          slot
        }
      }
    `;

    const getResponse = await dataConnect.executeGraphql(GET_STAFF_QUERY, {
      variables: { staffId: staffId },
    });

    if (!getResponse.data?.staff) {
      throw new Error("Staff record not found");
    }

    const staffRecord = getResponse.data.staff;
    const currentSlotCount = staffRecord.slot || 0;
    const maxDailySlots = 4; // Default max slots
    const isIncrease = operation === 'increase';
    
    let newSlotCount;
    if (isIncrease) {
      newSlotCount = Math.min(currentSlotCount + 1, maxDailySlots);
    } else {
      newSlotCount = Math.max(0, currentSlotCount - 1);
    }

    const UPDATE_STAFF_SLOT_MUTATION = `
      mutation UpdateStaffSlot($staffId: String!, $slot: Int!) @auth(level: USER) {
        staff_update(key: {id: $staffId}, data: {slot: $slot})
      }
    `;

    const variables = {
      staffId: staffRecord.id,
      slot: newSlotCount,
    };

    console.log("Executing GraphQL mutation:", UPDATE_STAFF_SLOT_MUTATION, "with variables:", variables);
    const response = await dataConnect.executeGraphql(UPDATE_STAFF_SLOT_MUTATION, {
      variables: variables,
    });

    return {
      success: true,
      data: response.data,
      message: `Staff slot count ${operation}d successfully`,
      previousSlotCount: currentSlotCount,
      newSlotCount: newSlotCount,
      maxDailySlots: maxDailySlots
    };
  } catch (error) {
    console.error(`Error ${operation}ing staff slot count:`, error);
    throw error;
  }
};


module.exports = {
  updateUserRoleToStaff,
  updateUser,
  updateStaffSlotCount,
  updateUserRoleToAdmin
};