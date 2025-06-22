const { dataConnect } = require("../../config/firebase.js");

const updateBlog = async (req, res) => {
  try {
    const { blogId, content, imageUrl } = req.body;

    // Validate input
    if (!blogId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Blog ID is required",
      });
    }

    const UPDATE_BLOG_MUTATION = `
      mutation UpdateBlog($blogId: String!, $content: String, $imageUrl: String) @auth(level: USER) {
        blog_update(key: { id: $blogId }, data: { content: $content, imageUrl: $imageUrl }) {
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
      blogId,
      content: content || null,
      imageUrl: imageUrl || null,
    };

    const response = await dataConnect.executeGraphql(UPDATE_BLOG_MUTATION, {
      variables,
    });

    const blog = response.data?.blog_update;

    if (!blog) {
      throw new Error("Failed to update blog");
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Blog updated successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error updating blog:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to update blog",
      error: error.message,
    });
  }
};

module.exports = {
  updateBlog,
};