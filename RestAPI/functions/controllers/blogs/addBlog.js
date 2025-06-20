const { dataConnect } = require("../../config/firebase.js");

const createBlog = async (req, res) => {
  try {
    const { id, userId, content, imageUrl } = req.body;

    // Validate input
    if (!id) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Blog ID is  required",
      });
    }

    if (!userId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "User ID is  required",
      });
    }

    if (!content) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Content is  required",
      });
    }

    const CREATE_BLOG_MUTATION = `
      mutation CreateBlog($id: String!, $userId: String!, $content: String!, $imageUrl: String) @auth(level: USER) {
        blog_insert(data: { id: $id, userId: $userId, content: $content, imageUrl: $imageUrl }) {
          id
          user {
            id
            fullname
            avatar
          }
          content
          imageUrl
          createdAt
        }
      }
    `;

    const variables = {
      id,
      userId,
      content,
      imageUrl: imageUrl || null,
    };

    console.log("Executing GraphQL mutation:", CREATE_BLOG_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(CREATE_BLOG_MUTATION, {
      variables,
    });

    const blog = response.data?.blog_insert;

    if (!blog) {
      throw new Error("Failed to create blog");
    }

    res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Blog created successfully",
      data: blog,
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
  createBlog,
};