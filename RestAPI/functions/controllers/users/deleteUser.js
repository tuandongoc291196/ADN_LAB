const { admin, dataConnect } = require("../../config/firebase.js"); 
const {checkUserExists} = require("../users/userUtils.js");
const { getRoleByUserId } = require("../roles/getRoles.js");
const { deleteStaff } = require("../staffs/deleteStaff.js");

const deleteUser = async (req, res) => {
    try {
        const { userId } = req.body;

        if (!userId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "userId is required"
            });
        }

        if (!await checkUserExists(userId)) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "User not found"
            });
        }

        const role = await getRoleByUserId(userId);
        console.log("User role:", role.id);
        
        const userRecord = await admin.auth().deleteUser(userId);
        console.log("Deleted user record:", userRecord);

        let deletedStaff;
        if (role.id === "1" || role.id === "2") {
            deletedStaff = await deleteStaff(userId);
            console.log("Deleted staff:", deletedStaff);
        }

        const DELETE_USER_QUERY = `
            mutation DeleteUser($id: String!) @auth(level: USER) {
                user_delete(key: {id: $id})
            }
        `;

        const variables = { 
            id: userId 
        };

        const response = await dataConnect.executeGraphql(DELETE_USER_QUERY, { variables });
        const deletedUser = response.data.user_delete;

        if (!deletedUser) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "User not found or deletion failed"
            });
        }

        const responseData = {
            deletedStaff: deletedStaff || null,
            deletedUser: deletedUser || null
        }

        console.log("Deleted user:", deletedUser);
        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "User deleted successfully",
            data: responseData
        });
    } catch (error) {
        console.error("Error deleting user:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Failed to delete user",
            error: error.message
        });
    }
}

module.exports = {
    deleteUser,
};