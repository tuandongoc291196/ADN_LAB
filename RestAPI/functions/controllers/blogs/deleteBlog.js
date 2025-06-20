const { dataConnect } = require("../../config/firebase.js");

const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.body;

    // Validate input
    if (!blogId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Blog ID is required",
      });
    }

    const DELETE_BLOG_MUTATION = `
      mutation DeleteBlog($blogId: String!) @auth(level: USER) {
        blog_delete(key: { id: $blogId })
      }
    `;

    const variables = {
      blogId,
    };

    console.log("Executing GraphQL mutation:", DELETE_BLOG_MUTATION, "with variables:", variables);

    const response = await dataConnect.executeGraphql(DELETE_BLOG_MUTATION, {
      variables,
    });

    const result = response.data?.blog_delete;

    if (!result) {
      throw new Error("Failed to delete blog");
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Blog deleted successfully",
      data: { blogId },
    });
  } catch (error) {
    console.error("Error deleting blog:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to delete blog",
      error: error.message,
    });
  }
};

module.exports = {
  deleteBlog,
};