const { dataConnect } = require("../../config/firebase.js");
const { checkServiceExists } = require("./serviceUtils.js");

const {deleteMethodServices} = require("../methodService/deleteMethodService.js");

const deleteService = async (req, res) => {
    try {
        const { serviceId } = req.body;

        if (!serviceId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "serviceId is required",
            });
        }

        if (!(await checkServiceExists(serviceId))) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "Service does not exist",
            });
        }

        const variables = {
            serviceId: serviceId
        };
        const DELETE_SERVICE_MUTATION = `
          mutation DeleteService($serviceId: String!) {
            service_delete(id: $serviceId) 
          }
        `;

        const responseServiceDel = await dataConnect.executeGraphql(DELETE_SERVICE_MUTATION, { variables: variables});
        const responseServiceMethodsDelData = await deleteMethodServices(serviceId);

        const responseServiceDelData = responseServiceDel.data;
        const respondData = {
          responseServiceDelData,
          responseServiceMethodsDelData
        };

        return res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Service deleted successfully",
            data: respondData,
        });
    } catch (error) {
        console.error("Error deleting service:", error);
        return res.status(500).json({
            statusCode: 500,
            status: "error",
            message: error.message || "Internal Server Error",
        });
    }
}

module.exports = {
    deleteService,
};
