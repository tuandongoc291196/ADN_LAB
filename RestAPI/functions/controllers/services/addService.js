const { dataConnect } = require("../../config/firebase.js");
const { checkCatergoryExists } = require("../categories/categoryUtils.js");
const { checkServiceExists } = require("./serviceUtils.js");
const { checkMethodExists } = require("../methods/methodUtils.js");
const { addServiceMethod } = require("../methodService/addMethodService.js");

const addService = async (req, res) => {
    try {
        const {
            title,
            description,
            fullDescription,
            price,
            duration,
            categoryId,
            icon,
            featured,
            methods
        } = req.body;
        
        if (!title) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Title is required",
            });
        }

        if (!description) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Description is required",
            });
        }

        if (!fullDescription) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Full description is required",
            });
        }

        if (!price) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Price is required",
            });
        }

        if (!duration) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Duration is required",
            });
        }

        if (!categoryId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Category ID is required",
            });
        }

        if (!icon) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Icon is required",
            });
        }

        if (typeof featured !== 'boolean') {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Featured must be a boolean value",
            });
        }

        if (!methods || !Array.isArray(methods) || methods.length === 0) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Methods array is required and must not be empty",
            });
        }

        const variables = {
            id : title,
            title: title,
            description: description,
            fullDescription: fullDescription,
            price: price,
            duration: duration,
            categoryId: categoryId,
            icon: icon,
            featured: featured,
        };

        if (!(await checkCatergoryExists(categoryId))) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Category does not exist",
            });
        }

        if (await checkServiceExists(variables.id)) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "Service with this ID already exists",
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

        const ADD_SERVICE_MUTATION = `
            mutation CreateService($id: String!, $title: String!, $description: String!, $fullDescription: String, $price: Float!, $duration: String!, $categoryId: String!, $icon: String, $featured: Boolean!) @auth(level: USER) {
                service_insert(data: {id: $id, title: $title, description: $description, fullDescription: $fullDescription, price: $price, duration: $duration, categoryId: $categoryId, icon: $icon, featured: $featured})
            }
        `;

        const response = await dataConnect.executeGraphql(ADD_SERVICE_MUTATION, { variables });
        const responseData = response.data.service_insert || {};

        for (const methodId of methods) {
            await addServiceMethod(variables.id, methodId);
        }

        res.status(201).json({
            statusCode: 201,
            status: "success",
            message: "Service and ServiceMethods added successfully",
            data: responseData,
        });
    } catch (error) {
        console.error("Error adding service:", error);
        res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Failed to add service",
            error: error.message,
        });
    }
}

module.exports = {
    addService,
};