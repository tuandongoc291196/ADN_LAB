const { dataConnect } = require("../../config/firebase.js");
const { checkBlogExists } = require("./blogUtils.js");
const { checkUserExists } = require("../users/userUtils.js");
const { getRoleByUserId } = require("../roles/getRoles.js");
const { randomAlphanumeric } = require("../utils/utilities.js");

const addBlog = async (req, res) => {
  try {
    const { userId, title, content, status, imageUrl } = req.body;

    if (!userId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "User ID is required",
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
        message: "You do not have permission to create a blog",
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
    
    const id = `ADNBLOG${await randomAlphanumeric(6, 6)}`;
    if (await checkBlogExists(id)) {
      return res.status(409).json({ message: "Blog ID conflict, please try again." });
    }

    const CREATE_BLOG_MUTATION = `
      mutation CreateBlog($id: String!, $userId: String!, $title: String!, $content: String!, $imageUrl: String, $status: String) {
        blog_insert(data: {id: $id, userId: $userId, title: $title, content: $content, imageUrl: $imageUrl, status: $status})
      }
    `;

    const variables = {
      id,
      userId,
      title,
      content,
      imageUrl: imageUrl || null,
      status: status || "draft"
    };

    await dataConnect.executeGraphql(CREATE_BLOG_MUTATION, { variables });

    res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Blog created successfully",
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