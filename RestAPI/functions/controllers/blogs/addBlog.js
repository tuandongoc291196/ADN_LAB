const { dataConnect } = require("../../config/firebase.js");
const { checkBlogExists } = require("./blogUtils.js");
const { checkUserExists } = require("../users/userUtils.js");
const { getRoleByUserId } = require("../roles/getRoles.js");
const { randomAlphanumeric } = require("../utils/utilities.js");
const { uploadMultipleImagesUtil } = require("../utils/imageUtils.js");
const Busboy = require('busboy');

const addBlog = async (req, res) => {
  try {
    let imageUrls = [];
    let formData = {};
    
    const busboy = Busboy({ headers: req.headers });
    
    const parseFormData = new Promise((resolve, reject) => {
      busboy.on('field', (fieldname, value) => {
        formData[fieldname] = value;
      });
      
      busboy.on('finish', () => {
        resolve();
      });
      
      busboy.on('error', (error) => {
        reject(error);
      });
      
      busboy.end(req.rawBody);
    });
    
    await parseFormData;
    
    const { userId, title, content, status } = formData;

    const randomNumbers = await randomAlphanumeric(6, 6);
    const id = `ADNBLOG${randomNumbers}`;

    if (!userId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "userId is required",
      });
    }

    if (!title) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "title is required",
      });
    }

    if (!content) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "content is required",
      });
    }

    if (!(await checkUserExists(userId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "User not found",
      });
    }

    const userRole = await getRoleByUserId(userId);
    if (!userRole || userRole.id !== "3") {
      return res.status(403).json({
        statusCode: 403,
        status: "error",
        message: "User does not have permission to create blogs",
      });
    }

    if (await checkBlogExists(id)) {
      return res.status(409).json({
        statusCode: 409,
        status: "error",
        message: "Blog with this ID already exists",
      });
    }

    try {
      imageUrls = await uploadMultipleImagesUtil(req, 'blogs', id);
    } catch (imageError) {
      console.log("No images uploaded or image upload failed:", imageError.message);
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "At least one image is required",
      });
    }

    const CREATE_BLOG_MUTATION = `
      mutation CreateBlog($id: String!, $userId: String!, $title: String!, $content: String!, $imageUrl: String, $status: String) @auth(level: USER) {
        blog_insert(data: {id: $id, userId: $userId, title: $title, content: $content, imageUrl: $imageUrl, status: $status})
      }
    `;

    const variables = {
      id: id,
      userId: userId,
      title: title,
      content: content,
      imageUrl: imageUrls[0],
      status: status || "DRAFT"
    };

    console.log("Executing GraphQL mutation:", CREATE_BLOG_MUTATION, "with variables:", variables);
    const response = await dataConnect.executeGraphql(CREATE_BLOG_MUTATION, {
      variables : variables,
    });

    const responseData = response.data;
    console.log("Response data:", responseData);
    
    res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Blog created successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
      return res.status(409).json({
        statusCode: 409,
        status: "error",
        message: "Blog with this ID already exists",
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
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

module.exports = {
  addBlog,
};