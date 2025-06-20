const { dataConnect } = require("../../config/firebase.js");

const addServiceMethods = async (serviceId, serviceMethods) => {
  try {
    const CREATE_SERVICE_METHODS = `
      mutation CreateServiceCollectionMethod($id: String!, $serviceId: String!, $methodId: String!, $methodTitle: String!, $methodDescription: String, $methodIcon: String, $methodColor: String, $methodNote: String, $methodProcess: String, $allowedFor: String) @auth(level: USER) {
        serviceCollectionMethod_insert(data: {id: $id, serviceId: $serviceId, methodId: $methodId, methodTitle: $methodTitle, methodDescription: $methodDescription, methodIcon: $methodIcon, methodColor: $methodColor, methodNote: $methodNote, methodProcess: $methodProcess, allowedFor: $allowedFor})
      }
    `;

    const methodVariables = serviceMethods.map((methodId) => ({
      id: `${serviceId}-${methodId}`,
      serviceId: serviceId,
      methodId: methodId,
      methodTitle: "",
      methodDescription: "",
      methodIcon: "",
      methodColor: "",
      methodNote: "",
      methodProcess: "",
      allowedFor: ""
    }));

    const responseMethodData = [];
    for (const methodVariable of methodVariables) {
      try {
        console.log("Creating service method:", methodVariable);
        const methodResponse = await dataConnect.executeGraphql(CREATE_SERVICE_METHODS, {
          variables: methodVariable,
        });
        responseMethodData.push(methodResponse.data);
        console.log("Method created successfully:", methodResponse.data);
      } catch (methodError) {
        console.error("Error creating service method:", methodError);
        throw methodError;
      }
    }
    
    return responseMethodData;
  } catch (error) {
    console.error("Error creating service methods:", error);
    throw error;
  }
};

const addService = async (req, res) => {
  try {
    const {
      id,
      title,
      description,
      fullDescription,
      price,
      duration,
      category,
      serviceType,
      hasLegalValue,
      icon,
      participants,
      requiredDocuments,
      procedures,
      serviceMethods,
      featured
    } = req.body;

    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "id is required",
      });
    }

    if (!title) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "title is required",
      });
    }

    if (!description) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "description is required",
      });
    }

    if (!price) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "price is required",
      });
    }

    if (!duration) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "duration is required",
      });
    }

    if (!category) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "category is required",
      });
    }

    if (!serviceType) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "serviceType is required",
      });
    }

    if (hasLegalValue === undefined || hasLegalValue === null) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "hasLegalValue is required",
      });
    }

    if (!serviceMethods || !Array.isArray(serviceMethods) || serviceMethods.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "serviceMethods is required and must be a non-empty array",
      });
    }

    const CREATE_DNA_SERVICE = `
        mutation CreateDnaService($id: String!, $title: String!, $description: String!, $fullDescription: String, $price: String!, $duration: String!, $category: String!, $serviceType: String!, $hasLegalValue: Boolean!, $icon: String, $participants: String, $requiredDocuments: String, $procedures: String, $featured: Boolean!) @auth(level: USER) {
            dnaService_insert(data: {id: $id, title: $title, description: $description, fullDescription: $fullDescription, price: $price, duration: $duration, category: $category, serviceType: $serviceType, hasLegalValue: $hasLegalValue, icon: $icon, participants: $participants, requiredDocuments: $requiredDocuments, procedures: $procedures, featured: $featured})
        }
    `;

    const serviceVariables = {
      id,
      title,
      description,
      fullDescription: fullDescription || "",
      price,
      duration,
      category,
      serviceType,
      hasLegalValue,
      icon: icon || "",
      participants: participants || "",
      requiredDocuments: requiredDocuments || "",
      procedures: procedures || "",
      featured: featured || false
    };

    console.log("Executing GraphQL mutation:", CREATE_DNA_SERVICE, "with variables:", serviceVariables);
    const response = await dataConnect.executeGraphql(CREATE_DNA_SERVICE, {
      variables: serviceVariables,
    });

    const responseServiceData = response.data;
    console.log("Response service data:", responseServiceData);
    
    const responseMethodData = await addServiceMethods(id, serviceMethods);
    
    res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "DNA Service and methods created successfully",
      data: {
        service: responseServiceData,
        methods: responseMethodData
      },
    });
  } catch (error) {
    console.error("Error creating DNA service:", error);
    if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
      return res.status(409).json({
        statusCode: 409,
        status: "error",
        message: "DNA Service with this ID already exists",
        error: error.message,
      });
    }

    if (error.codePrefix === 'data-connect' && error.errorInfo) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Database operation failed",
        error: error.message,
      });
    }

    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to create DNA service",
      error: error.message,
    });
  }
};

module.exports = {
  addService,
  addServiceMethods
};