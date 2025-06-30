const { dataConnect } = require("../../config/firebase.js");
const { checkSampleExists } = require("../sample/sampleUtils.js");

const updateSample = async (req, res) => {
    try {
        const { sampleId, sampleQuality, sampleConcentration, notes } = req.body;
        if (!sampleId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "sampleId is required"
            });
        }

        if (!sampleQuality) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "sampleQuality is required"
            });
        }

        if (!sampleConcentration|| typeof sampleConcentration !== 'number' || sampleConcentration <= 0) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "sampleConcentration is required"
            });
        }

        if (!notes) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "notes are required"
            });
        }

        if (!(await checkSampleExists(sampleId))) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "Sample does not exist"
            });
        }

        const UPDATE_SAMPLE = `
            mutation UpdateSample($sampleId: String!, $sampleQuality: String, $sampleConcentration: Float, $notes: String) @auth(level: USER) {
                sample_update(key: {id: $sampleId}, data: {sampleQuality: $sampleQuality, sampleConcentration: $sampleConcentration, notes: $notes, updatedAt_expr: "request.time"})
            }
        `;

        const variables = {
            sampleId: sampleId,
            sampleQuality: sampleQuality,
            sampleConcentration: sampleConcentration,
            notes: notes
        };

        console.log("Updating sample with ID:", sampleId);
        const response = await dataConnect.executeGraphql(UPDATE_SAMPLE, {
            variables: variables
        });

        const responseData = response.data.sample_update;
        if (!responseData) {
            return res.status(500).json({
                statusCode: 500,
                status: "error",
                message: "Failed to update sample"
            });
        }
        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Sample updated successfully",
            data: responseData
        });
    } catch (error) {
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: `Internal server error: ${error.message}`
        });
    }
}

module.exports = {
    updateSample
};