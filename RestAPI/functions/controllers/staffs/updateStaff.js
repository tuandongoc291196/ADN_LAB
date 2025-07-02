const { dataConnect } = require("../../config/firebase.js");
const { checkStaffExists } = require("./staffUtils.js");

const updateStaff = async (req, res) => {
    try {
        const {staffId, specification, certifications} = req.body;

        if (!staffId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "staffId is required"
            });
        }

        if (!await checkStaffExists(staffId)) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "Staff not found"
            });
        }

        if (!specification || !Array.isArray(specification)) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "specification must be an array"
            });         
        }
        
        if (!certifications || !Array.isArray(certifications)) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "certifications must be an array"
            });
        }

        const UPDATE_STAFF_QUERY = `
            mutation UpdateStaff($staffId: String!, $specification: [String!], $certifications: [String!]) @auth(level: USER) {
                staff_update(key: {id: $staffId}, data: {specification: $specification, certifications: $certifications, updatedAt_expr: "request.time"})
            } 
        `;

        const variables = {
            staffId: staffId,
            specification: specification,
            certifications: certifications,
        };

        const response = await dataConnect.executeGraphql(UPDATE_STAFF_QUERY, { 
            variables: variables 
        });
        const updatedStaff = response.data.staff_update;
        if (!updatedStaff) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "Staff not found or update failed"
            });
        }
        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Staff updated successfully",
            data: updatedStaff
        });
    } catch (error) {
        console.error("Error updating staff:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Internal server error"
        });
    }
}

module.exports = {
    updateStaff
};