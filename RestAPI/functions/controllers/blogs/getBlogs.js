const { dataConnect } = require("../../config/firebase.js");

const getAllBlogs = async (req, res) => {
  try {
    const GET_BLOGS_QUERY = `
      query GetBlogs @auth(level: USER) {
        blogs(orderBy: {createdAt: DESC}) {
          id
          user {
            id
            fullname
            avatar
          }
          title
          content
          imageUrl
          status
          createdAt
          updatedAt
        }
      }
    `;
    console.log("Executing GraphQL query:", GET_BLOGS_QUERY);
    
    const response = await dataConnect.executeGraphql(GET_BLOGS_QUERY);
    const responseData = response.data;

    if (!responseData.blogs) {
      responseData.blogs = [];
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: responseData.blogs.length > 0 ? "Blogs retrieved successfully" : "No blogs found",
      data: responseData,
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

const getOneBlog = async (req, res) => {
  try {
    const { blogId } = req.body;

    if (!blogId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "blogId is required",
      });
    }

    const GET_ONE_BLOG_QUERY = `
      query GetBlogById($blogId: String!) @auth(level: USER) {
        blog(key: {id: $blogId}) {
          id
          user {
            id
            fullname
            avatar
            role {
              name
            }
          }
          title
          content
          imageUrl
          status
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      blogId: blogId,
    };

    console.log("Executing GraphQL query:", GET_ONE_BLOG_QUERY, "with variables:", variables);
    
    const response = await dataConnect.executeGraphql(GET_ONE_BLOG_QUERY, {
      variables: variables,
    }); 
    console.log("Response from GraphQL:", response);
    
    const responseData = response.data;
    if (responseData.blog === null) {
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
      data: responseData,
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

const getBlogsByUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "userId is required",
      });
    }

    const GET_BLOGS_BY_USER_QUERY = `
      query GetBlogsByUser($userId: String!) @auth(level: USER) {
        blogs(where: {userId: {eq: $userId}}, orderBy: {createdAt: DESC}) {
          id
          title
          content
          imageUrl
          status
          createdAt
          updatedAt
        }
      }
    `;

    const variables = {
      userId: userId,
    };

    console.log("Executing GraphQL query:", GET_BLOGS_BY_USER_QUERY, "with variables:", variables);
    
    const response = await dataConnect.executeGraphql(GET_BLOGS_BY_USER_QUERY, {
      variables: variables,
    });

    const responseData = response.data;
    if (!responseData.blogs || responseData.blogs.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "No blogs found for this user",
      });
    }

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "User blogs retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error fetching user blogs:", error);
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve user blogs",
      error: error.message,
    });
  }
};

const getOneBlogByBlogId = async (blogId) => {
  try {
    if (!blogId) {
      throw new Error("blogId is required");
    }

    const GET_BLOG_BY_BOOKING_QUERY = `
      query GetBlogById($blogId: String!) @auth(level: USER) {
        blog(key: {id: $blogId}) {
            id
            user {
            id
            fullname
            avatar
            role {
                name
            }
            }
            title
            content
            imageUrl
            status
            createdAt
            updatedAt
        }
    }
    `;

    const variables = {
      blogId: blogId,
    };

    console.log("Executing GraphQL query:", GET_BLOG_BY_BOOKING_QUERY, "with variables:", variables);
    
    const response = await dataConnect.executeGraphql(GET_BLOG_BY_BOOKING_QUERY, {
      variables: variables,
    });

    const responseData = response.data.blog;
    console.log("Blog data retrieved by booking ID:", responseData);
    return responseData;
  } catch (error) {
    console.error("Error retrieving blog by booking ID:", error);
    throw error;
  }
};

module.exports = {
  getAllBlogs,
  getOneBlog,
  getBlogsByUser,
  getOneBlogByBlogId,
};