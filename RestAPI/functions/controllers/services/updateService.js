const { dataConnect } = require("../../config/firebase.js");
const { checkCatergoryExists } = require("../categories/categoryUtils.js");
const { checkServiceExists } = require("./serviceUtils.js");
const { getServiceMethods } = require("../methodService/methodServiceUtils.js");
const { addServiceMethod } = require("../methodService/addMethodService.js");
const { deleteOneMethodService } = require("../methodService/deleteMethodService.js");
const { checkMethodExists } = require("../methods/methodUtils.js");

const updateService = async (req, res) => {
    try {
        const {
            serviceId,
            title,
            description,
            fullDescription,
            price,
            duration,
            categoryId,
            icon,
            featured,
            isActive,
            methods,
        } = req.body;
        
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

        if (categoryId && !(await checkCatergoryExists(categoryId))) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Category does not exist",
            });
        }

        if (featured !== undefined && typeof featured !== 'boolean') {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Featured must be a boolean value",
            });
        }

        if (isActive !== undefined && typeof isActive !== 'boolean') {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "isActive must be a boolean value",
            });
        }

        for (const methodId of methods) {
            if (!(await checkMethodExists(methodId))) {
                return res.status(400).json({
                    statusCode: 400,
                    status: "error",
                    message: `Method with ID ${methodId} does not exist`,
                });
            }
        }

        const variables = {
            serviceId: serviceId,
            title: title,
            description: description,
            fullDescription: fullDescription,
            price: price,
            duration: duration,
            categoryId: categoryId,
            icon: icon,
            featured: featured,
            isActive: isActive,
        };

        const UPDATE_SERVICE_MUTATION = `
            mutation UpdateService($serviceId: String!, $title: String, $description: String, $fullDescription: String, $price: Float, $duration: String, $categoryId: String, $icon: String, $featured: Boolean, $isActive: Boolean) @auth(level: USER) {
                service_update(key: {id: $serviceId}, data: {title: $title, description: $description, fullDescription: $fullDescription, price: $price, duration: $duration, categoryId: $categoryId, icon: $icon, featured: $featured, isActive: $isActive, updatedAt_expr: "request.time"})
            }
        `;

        const response = await dataConnect.executeGraphql(UPDATE_SERVICE_MUTATION, { variables });
        const responseData = response.data.service_update || {};

        if (methods && Array.isArray(methods)) {
            try {
                const currentMethods = await getServiceMethods(serviceId);
                const currentMethodIds = currentMethods.map(sm => sm.methodId);
                
                const methodsToAdd = methods.filter(methodId => !currentMethodIds.includes(methodId));
                
                const methodsToRemove = currentMethodIds.filter(methodId => !methods.includes(methodId));
                
                for (const methodId of methodsToAdd) {
                    await addServiceMethod(serviceId, methodId);
                }
                
                for (const methodId of methodsToRemove) {
                    await deleteOneMethodService(serviceId, methodId);
                }
            } catch (error) {
                console.error("Error updating service methods:", error);
            }
        }

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Service and its methods updated successfully",
            data: responseData,
        });
    } catch (error) {
        console.error("Error updating service:", error);
        res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Failed to update service",
            error: error.message,
        });
    }
}

module.exports = {
    updateService,
};