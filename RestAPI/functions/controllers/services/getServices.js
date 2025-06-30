const { dataConnect } = require("../../config/firebase.js");
const { checkCatergoryExists } = require("../categories/categoryUtils.js");
const {getServiceMethods} = require("../methodService/methodServiceUtils.js");
const { checkServiceExists } = require("./serviceUtils.js");

const getOneService = async (req, res) => {
    try {
        const {serviceId} = req.body;

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

        const GET_SERVICE_QUERY = `
            query GetServiceById($serviceId: String!) @auth(level: USER) {
                service(key: {id: $serviceId}) {
                    id
                    title
                    description
                    fullDescription
                    price
                    duration
                    categoryId
                    category {
                    id
                    name
                    description
                    hasLegalValue
                    }
                    icon
                    isActive
                    featured
                    createdAt
                    updatedAt
                }
            }
        `;

        const response = await dataConnect.executeGraphql(GET_SERVICE_QUERY, { 
            variables 
        });

        const responseServiceData = response.data.service;
        const responseMethodData = await getServiceMethods(serviceId);
        const responseData = {
            service: responseServiceData,
            methods: responseMethodData,
        }
        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Service retrieved successfully",
            data: responseData,
        });
    } catch (error) {
        console.error("Error fetching service:", error);
        res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Failed to retrieve service",
            error: error.message,
        });
    }
}

const getAllServices = async (req, res) => {
    try {
        const GET_SERVICES_QUERY = `
            query GetServices @auth(level: USER) {
                services(orderBy: {title: ASC}) {
                    id
                    title
                    description
                    fullDescription
                    price
                    duration
                    categoryId
                    category {
                    id
                    name
                    description
                    hasLegalValue
                    }
                    icon
                    isActive
                    featured
                    createdAt
                    updatedAt
                }
                }
        `;

        const response = await dataConnect.executeGraphql(GET_SERVICES_QUERY);

        const responseData = response.data.services || [];
        if (!responseData || responseData.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "No services found",
            });
        }
        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Services retrieved successfully",
            data: responseData,
        });
    } catch (error) {
        console.error("Error fetching services:", error);
        res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Failed to retrieve services",
            error: error.message,
        });
    }
}

const getServiceByCategoryId = async (req, res) => {
    try {  
        const {categoryId} = req.body;

        if (!categoryId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "categoryId is required",
            });
        }

        if (!(await checkCatergoryExists(categoryId))) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "Category does not exist",
            });
        }

        const variables = { 
            categoryId: categoryId 
        };  
        const GET_SERVICES_BY_CATEGORY_QUERY = `
            query GetServicesByCategory($categoryId: String!) @auth(level: USER) {
                services(where: {categoryId: {eq: $categoryId}}, orderBy: {title: ASC}) {
                    id
                    title
                    description
                    fullDescription
                    price
                    duration
                    category {
                    id
                    name
                    hasLegalValue
                    }
                    icon
                    isActive
                    featured
                    createdAt
                    updatedAt
                }
            }
        `;
        const response = await dataConnect.executeGraphql(GET_SERVICES_BY_CATEGORY_QUERY, {
            variables: variables,
        });
        const responseData = response.data.services;
        if (!responseData || responseData.length === 0) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: "No services found for this category",
            });
        }
        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Services retrieved successfully by category",
            data: responseData,
        });    
    } catch (error) {
        console.error("Error fetching services by category:", error);
        res.status(500).json({
            statusCode: 500,
            status: "error",
            message: "Failed to retrieve services by category",
            error: error.message,
        });
    }
};

module.exports = {
    getOneService,
    getAllServices,
    getServiceByCategoryId,
};