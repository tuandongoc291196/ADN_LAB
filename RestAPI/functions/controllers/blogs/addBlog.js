const { dataConnect } = require("../../config/firebase.js");
const { checkBlogExists } = require("./blogUtils.js");
const {checkUserExists } = require("../users/userUtils.js");
const { randomAlphanumeric } = require("../utils/utilities.js");

const addBlog = async (req, res) => {
  try {
    const {userId, title, content, isActive, imageUrl } = req.body;

    if (!userId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "User ID is required",
      });
    }

    if (!await checkUserExists(userId)) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "User not found",
      });
    }

    if (!title) {
      return res.status(400).json({        
        statusCode: 400,
        status: "error",
        message: "Blog title is required",
      });
    }
    
    if (!content) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Blog content is required",
      });
    }

    if (!isActive || typeof isActive !== 'boolean') {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Blog status is required and must be a boolean",
      });
    }

    if (!imageUrl) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Blog image URL is required",
      });
    }
    
    const id = `ADNBLOG${await randomAlphanumeric(6, 6)}`;
    if (await checkBlogExists(id)) {
      return res.status(409).json({ message: "Blog ID conflict, please try again." });
    }

    const CREATE_BLOG_MUTATION = `
      mutation CreateBlog($id: String!, $userId: String!, $title: String!, $content: String!, $imageUrl: String, $isActive: Boolean) {
        blog_insert(data: {id: $id, userId: $userId, title: $title, content: $content, imageUrl: $imageUrl, isActive: $isActive})
      }
    `;

    const variables = {
      id,
      userId,
      title,
      content,
      imageUrl: imageUrl || null,
      isActive: isActive
    };

    const response = await dataConnect.executeGraphql(CREATE_BLOG_MUTATION, { 
      variables: variables 
    });

    const responseData = response.data.blog_insert;
    res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Blog created successfully",
      data: responseData,
    });

  } catch (error) {
    console.error("Error creating blog:", error);
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