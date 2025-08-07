// Import dataConnect từ Firebase config để thực thi GraphQL queries
const { dataConnect } = require("../../config/firebase.js");
const { checkUserExists } = require("../users/checkUserExists.js");


const getAllBlogs = async (req, res) => {
  try {
    // GraphQL query để lấy tất cả blogs, sắp xếp theo thời gian tạo mới nhất
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
          isActive
          createdAt
          updatedAt
        }
      }
    `;
    
    // Log để debug - hiển thị query đang thực thi
    console.log("Executing GraphQL query:", GET_BLOGS_QUERY);
    
    // Thực thi GraphQL query không có variables
    const response = await dataConnect.executeGraphql(GET_BLOGS_QUERY);
    
    // Lấy array blogs từ response data
    const responseData = response.data.blogs;
    
    // Trả về success response với data blogs
    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Blogs retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    // Log lỗi với màu đỏ để dễ debug
    console.error("Error fetching blogs:", error);
    
    // Trả về error response với HTTP 500
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
    // Destructuring lấy blogId từ request body
    const { blogId } = req.body;
    
    // Log để debug - hiển thị blogId được yêu cầu
    console.log("Received request to get blog with ID:", blogId);
    
    // Validation: kiểm tra blogId có tồn tại không
    if (!blogId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "blogId is required",
      });
    }

    // GraphQL query với parameter blogId để lấy blog cụ thể
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
          isActive
          createdAt
          updatedAt
        }
      }
    `;

    // Tạo object variables để truyền vào GraphQL query
    const variables = {
      blogId: blogId, // Property shorthand trong ES6
    };

    // Log query và variables để debug
    console.log("Executing GraphQL query:", GET_ONE_BLOG_QUERY, "with variables:", variables);
    
    // Thực thi GraphQL query với variables
    const response = await dataConnect.executeGraphql(GET_ONE_BLOG_QUERY, {
      variables: variables,
    }); 
    
    // Log response để debug
    console.log("Response from GraphQL:", response);
    
    // Lấy data từ response
    const responseData = response.data;
    
    // Kiểm tra nếu blog không tồn tại (GraphQL trả về null)
    if (responseData.blog === null) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Blog not found",
      });
    }

    // Trả về success response với blog data
    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Blog retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    // Log lỗi với màu đỏ
    console.error("Error fetching blog:", error);
    
    // Trả về error response
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
    // Destructuring lấy userId từ request body
    const { userId } = req.body;

    // Validation: kiểm tra userId có tồn tại không
    if (!userId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "userId is required",
      });
    }

    // Kiểm tra user có tồn tại trong database không
    if (!await checkUserExists(userId)) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "User not found",
      });
    }

    // GraphQL query với filter theo userId
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

    // Tạo variables object
    const variables = {
      userId: userId,
    };

    // Log query và variables để debug
    console.log("Executing GraphQL query:", GET_BLOGS_BY_USER_QUERY, "with variables:", variables);
    
    // Thực thi GraphQL query với variables
    const response = await dataConnect.executeGraphql(GET_BLOGS_BY_USER_QUERY, {
      variables: variables,
    });

    // Lấy data từ response
    const responseData = response.data;
    
    // Kiểm tra nếu không có blogs cho user này
    if (!responseData.blogs || responseData.blogs.length === 0) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "No blogs found for this user",
      });
    }

    // Trả về success response với blogs data
    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "User blogs retrieved successfully",
      data: responseData,
    });
  } catch (error) {
    // Log lỗi với màu đỏ
    console.error("Error fetching user blogs:", error);
    
    // Trả về error response
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to retrieve user blogs",
      error: error.message,
    });
  }
};

/**
 * Export các functions để sử dụng trong routes
 * getAllBlogs: Lấy tất cả blogs
 * getOneBlog: Lấy một blog theo ID
 * getBlogsByUser: Lấy blogs theo user ID
 */
module.exports = {
  getAllBlogs,
  getOneBlog,
  getBlogsByUser,
};