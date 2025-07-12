const { error } = require("firebase-functions/logger");
const { dataConnect } = require("../../config/firebase.js");
const { checkStaffExists } = require("./staffUtils.js");
const { checkPositionExists } = require("../staffPositions/positionUtils.js");

const getStaffs = async (req, res) => {
    try {
        const GET_STAFFS_QUERY = `
            query GetStaffMembers @auth(level: USER) {
                staffs {
                    id
                    user {
                    id
                    fullname
                    gender
                    avatar
                    email
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

        const response = await dataConnect.executeGraphql(GET_STAFFS_QUERY);
        const staffs = response.data.staffs;
        if (!staffs || staffs.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                error: "No staff members found",
                message: "No staff members found"
            });
        }
        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Staff members retrieved successfully",
            data: staffs
        });
    } catch (error) {
        console.error("Error retrieving staff members:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Failed to retrieve staff members",
            error: error.message
        });
    }
};

const getStaffById = async (req, res) => {
    try {
        const {staffId} = req.body;
        if (!staffId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "staffId is required"
            });
        };

        if (!await checkStaffExists(staffId)) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "Staff not found"
            });
        };

        const GET_STAFF_BY_ID_QUERY = `
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

        const response = await dataConnect.executeGraphql(GET_STAFF_BY_ID_QUERY, { 
            variables: variables 
        });
        const staff = response.data.staff;
        if (!staff) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "Staff not found"
            });
        }
        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Staff member retrieved successfully",
            data: staff
        });
    } catch (error) {
        console.error("Error retrieving staff member:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Failed to retrieve staff member",
            error: error.message
        });
    }
};

const getStaffsByPosition = async (req, res) => {
    try {
        const { positionId } = req.body;
        if (!positionId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "positionId is required"
            });
        }

        if (!await checkPositionExists(positionId)) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "Position not found"
            });
        }

        const GET_STAFFS_BY_POSITION_QUERY = `
            query GetStaffByPosition($positionId: String!) @auth(level: USER) {
                staffs(where: {positionId: {eq: $positionId}}) {
                    id
                    user {
                    id
                    fullname
                    gender
                    avatar
                    email
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
            positionId: positionId
        };

        const response = await dataConnect.executeGraphql(GET_STAFFS_BY_POSITION_QUERY, {
            variables: variables
        });
        const staffs = response.data.staffs;
        if (!staffs || staffs.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "No staff members found for this position"
            });
        }
        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Staff members by position retrieved successfully",
            data: staffs
        });
    } catch (error) {
        console.error("Error retrieving staff members by position:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Failed to retrieve staff members by position",
            error: error.message
        });
    }
};

module.exports = {
    getStaffs,
    getStaffById,
    getStaffsByPosition
};