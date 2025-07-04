const {dataConnect} = require("../../config/firebase.js");

const deleteStaff = async (staffId) => {
    try {
        if (!staffId) {
            throw new Error("staffId is required");
        }

        const DELETE_STAFF_QUERY = `
            mutation DeleteStaff($staffId: String!) @auth(level: USER) {
                staff_delete(key: {id: $staffId})
            }
        `;

        const variables = {
            staffId: staffId,
        };

        const response = await dataConnect.executeGraphql(DELETE_STAFF_QUERY, { 
            variables: variables 
        });
        const deletedStaff = response.data.staff_delete;
        if (!deletedStaff) {
            throw new Error("Staff not found or deletion failed");
        }
        return deletedStaff;
    } catch (error) {
        console.error("Error deleting staff:", error);
        throw error;
    }
};

module.exports = {
    deleteStaff,
};