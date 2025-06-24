const { admin, dataConnect } = require("../../config/firebase.js"); 
const {checkRoleExists} = require("../roles/roleUtils.js");

const addUser = async (req, res) => {
  try {
    const { email, password, name, roleId } = req.body;

    if(!email) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "email is required",
      });
    }

    if(!password) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "password is required",
      });
    }

    if(!name) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "name is required",
      });
    }

    if(!roleId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "roleId is required",
      });
    }

    if (!await checkRoleExists(roleId)) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Role not found",
      });
    }

    const userRecord = await admin.auth().createUser({
      email: email,
      password: password,
      displayName: name,
    });

    const CREATE_USER_MUTATION = `
    mutation CreateUser($id: String!, $fullname: String!, $email: String!, $accountStatus: String!, $authProvider: String!, $roleId: String!) @auth(level: USER) {
      user_insert(data: {
        id: $id,
        fullname: $fullname,
        email: $email,
        accountStatus: $accountStatus,
        authProvider: $authProvider,
        roleId: $roleId
      }
    )}
    `;

    const variables = {
      id: userRecord.uid,
      fullname: name,
      email: email,
      accountStatus: "active",
      authProvider: "email",
      roleId: roleId
    };

    const responseAuth = await dataConnect.executeGraphql(CREATE_USER_MUTATION, {
      variables: variables,
    });
    const responseAuthData = responseAuth.data.user_insert;

    let responseStaffData = null;
    if (roleId === "1" || roleId === "2") {
      responseStaffData = await addUserToStaff(userRecord.uid, roleId);
    }

    const responseData = {
      responseAuthData,
      responseStaffData,
    }
    return res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "User created successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error adding user to staff:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to add user to staff",
      error: error.message,
    });
  }
};

const addUserToStaff = async (userId, positionId) => {
  try {
    if (!userId) {
      throw new Error("userId is required");
    }
    if (!positionId) {
      throw new Error("roleId is required");
    }

    const ADD_USER_TO_TABLES = `
    mutation AddMinimalStaffMember($id: String!, $positionId: String!) @auth(level: USER) {
      staff_insert(data: {id: $id, positionId: $positionId})
    }
    `;

    const variables = {
      id: userId,
      positionId: positionId,
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
  addUser,
  addUserToStaff,
};