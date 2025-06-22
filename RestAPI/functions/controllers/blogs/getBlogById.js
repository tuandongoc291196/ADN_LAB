const { dataConnect } = require("../../config/firebase.js");

const getBlogById = async (req, res) => {
  try {
    const { blogId } = req.params;

    // Validate input
    if (!blogId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Blog ID is required",
      });
    }

    const GET_BLOG_BY_ID_QUERY = `
      query GetBlogById($blogId: String!) @auth(level: USER) {
        blog(key: { id: $blogId }) {
          id
          user {
            id
            fullname
            avatar
            role {
              name
            }
          }
          content
          imageUrl
          createdAt
        }
      }
    `;

    const variables = {
      blogId,
    };

    const response = await dataConnect.executeGraphql(GET_BLOG_BY_ID_QUERY, {
      variables,
    });

    const blog = response.data?.blog;

    if (!blog) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Blog not found",
      });
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Blog retrieved successfully",
      data: blog,
    });
  } catch (error) {
    console.error("Error fetching blog:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve blog",
      error: error.message,
    });
  }
};

module.exports = {
  getBlogById,
};