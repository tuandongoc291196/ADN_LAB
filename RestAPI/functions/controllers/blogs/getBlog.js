const { dataConnect } = require("../../config/firebase.js");

const getAllBlogs = async (req, res) => {
  try {
    const { limit, offset } = req.query;

    const variables = {
      "limit": 20,
      "offset": 0
    };

    // Validate input
    if (isNaN(limit) || isNaN(offset) || limit < 1 || offset < 0) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Invalid limit or offset",
      });
    }

    

    const GET_BLOGS_QUERY = `
      query GetBlogs($limit: Int, $offset: Int) @auth(level: USER) {
        blogs(limit: $limit, offset: $offset, orderBy: { createdAt: DESC }) {
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

    console.log("Executing GraphQL query:", GET_BLOGS_QUERY, "with variables:", variables);

    const response = await dataConnect.executeGraphql(GET_BLOGS_QUERY, {
      variables,
    });

    const blogs = response.data?.blogs || [];

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Blogs retrieved successfully",
      data: blogs,
    });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve blogs",
      error: error.message,
    });
  }
};

module.exports = {
  getAllBlogs,
};