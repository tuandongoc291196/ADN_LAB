const { dataConnect } = require("../../config/firebase.js");
const { v4: uuidv4 } = require('uuid');

// ================== UTILITY FUNCTIONS ==================

const checkBlogExists = async (blogId) => {
  try {
    const CHECK_BLOG_EXISTS_QUERY = `
      query GetBlogById($blogId: String!) @auth(level: USER) {
        blog(key: { id: $blogId }) {
          id
          userId
          title
          content
          imageUrl
          createdAt
          updatedAt
        }
      }
    `;

    const variables = { blogId };
    
    const response = await dataConnect.executeGraphql(CHECK_BLOG_EXISTS_QUERY, { 
      variables 
    });
    
    return response.data.blog ? true : false;
  } catch (error) {
    console.error("Error checking blog existence:", error);
    throw error;
  }
};

const checkUserExists = async (userId) => {
  try {
    const CHECK_USER_EXISTS_QUERY = `
      query GetUserById($userId: String!) @auth(level: USER) {
        user(key: { id: $userId }) {
          id
        }
      }
    `;

    const variables = { userId };
    const response = await dataConnect.executeGraphql(CHECK_USER_EXISTS_QUERY, { 
      variables 
    });
    
    return response.data.user ? true : false;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
};

const validateBlogData = (blogData) => {
  const { title, content, userId } = blogData;
  
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return { isValid: false, message: "Title is required and must be a non-empty string" };
  }
  
  if (!content || typeof content !== 'string' || content.trim().length === 0) {
    return { isValid: false, message: "Content is required and must be a non-empty string" };
  }
  
  if (!userId || typeof userId !== 'string' || userId.trim().length === 0) {
    return { isValid: false, message: "UserId is required and must be a non-empty string" };
  }
  
  return { isValid: true };
};

const getBlogsByUserId = async (userId) => {
  try {
    const GET_USER_BLOGS_QUERY = `
      query GetUserBlogs($userId: String!) @auth(level: USER) {
        blogs(where: { userId: { eq: $userId } }, orderBy: { createdAt: DESC }) {
          id
          userId
          title
          content
          imageUrl
          createdAt
          updatedAt
          user {
            fullname
            email
            avatar
          }
        }
      }
    `;

    const variables = { userId };
    
    const response = await dataConnect.executeGraphql(GET_USER_BLOGS_QUERY, { 
      variables 
    });
    
    return response.data.blogs || [];
  } catch (error) {
    console.error("Error getting blogs by user ID:", error);
    throw error;
  }
};

// ================== API ENDPOINTS ==================

const addBlog = async (req, res) => {
  try {
    const {
      userId,
      title,
      content,
      imageUrl
    } = req.body;

    // Validate required fields
    const validation = validateBlogData({ title, content, userId });
    if (!validation.isValid) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: validation.message,
      });
    }

    // Check if user exists
    if (!(await checkUserExists(userId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "User not found",
      });
    }

    const blogId = uuidv4();

    const CREATE_BLOG_MUTATION = `
      mutation CreateBlog($id: String!, $userId: String!, $title: String!, $content: String!, $imageUrl: String) @auth(level: USER) {
        blog_insert(data: {
          id: $id,
          userId: $userId,
          title: $title,
          content: $content,
          imageUrl: $imageUrl
        })
      }
    `;

    const variables = {
      id: blogId,
      userId,
      title,
      content,
      imageUrl: imageUrl || null
    };

    const response = await dataConnect.executeGraphql(CREATE_BLOG_MUTATION, {
      variables,
    });

    return res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Blog created successfully",
      data: {
        blogId,
        ...variables
      },
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

const getAllBlogs = async (req, res) => {
  try {
    const GET_ALL_BLOGS_QUERY = `
      query GetAllBlogs @auth(level: USER) {
        blogs(orderBy: { createdAt: DESC }) {
          id
          userId
          title
          content
          imageUrl
          createdAt
          updatedAt
          user {
            fullname
            email
            avatar
          }
        }
      }
    `;

    const response = await dataConnect.executeGraphql(GET_ALL_BLOGS_QUERY);
    const blogs = response.data.blogs || [];

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "All blogs retrieved successfully",
      data: blogs,
      count: blogs.length,
    });

  } catch (error) {
    console.error("Error getting all blogs:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to get all blogs",
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

    const GET_BLOG_QUERY = `
      query GetBlog($blogId: String!) @auth(level: USER) {
        blog(key: { id: $blogId }) {
          id
          userId
          title
          content
          imageUrl
          createdAt
          updatedAt
          user {
            fullname
            email
            avatar
          }
        }
      }
    `;

    const variables = { blogId };

    const response = await dataConnect.executeGraphql(GET_BLOG_QUERY, {
      variables,
    });

    const blog = response.data.blog;

    if (!blog) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Blog not found",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Blog retrieved successfully",
      data: blog,
    });

  } catch (error) {
    console.error("Error getting blog:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to get blog",
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

    const blogs = await getBlogsByUserId(userId);

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "User blogs retrieved successfully",
      data: blogs,
      count: blogs.length,
    });

  } catch (error) {
    console.error("Error getting user blogs:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to get user blogs",
      error: error.message,
    });
  }
};

const updateBlog = async (req, res) => {
  try {
    const {
      blogId,
      title,
      content,
      imageUrl
    } = req.body;

    if (!blogId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "blogId is required",
      });
    }

    if (!(await checkBlogExists(blogId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Blog not found",
      });
    }

    // Validate fields if provided
    if (title !== undefined && (typeof title !== 'string' || title.trim().length === 0)) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Title must be a non-empty string",
      });
    }

    if (content !== undefined && (typeof content !== 'string' || content.trim().length === 0)) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Content must be a non-empty string",
      });
    }

    // Build update object with only provided fields
    const updateData = {};
    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (imageUrl !== undefined) updateData.imageUrl = imageUrl;

    // Always update the updatedAt timestamp
    updateData.updatedAt = new Date().toISOString();

    if (Object.keys(updateData).length === 1) { // Only updatedAt
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "At least one field must be provided for update",
      });
    }

    const UPDATE_BLOG_MUTATION = `
      mutation UpdateBlog($blogId: String!, $data: Blog_Data!) @auth(level: USER) {
        blog_update(key: { id: $blogId }, data: $data)
      }
    `;

    const variables = {
      blogId,
      data: updateData
    };

    const response = await dataConnect.executeGraphql(UPDATE_BLOG_MUTATION, {
      variables,
    });

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Blog updated successfully",
      data: {
        blogId,
        updatedFields: updateData
      },
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

const deleteBlog = async (req, res) => {
  try {
    const { blogId } = req.body;

    if (!blogId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "blogId is required",
      });
    }

    if (!(await checkBlogExists(blogId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Blog not found",
      });
    }

    const DELETE_BLOG_MUTATION = `
      mutation DeleteBlog($blogId: String!) @auth(level: USER) {
        blog_delete(key: { id: $blogId })
      }
    `;

    const variables = { blogId };

    const response = await dataConnect.executeGraphql(DELETE_BLOG_MUTATION, {
      variables,
    });

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Blog deleted successfully",
      data: {
        blogId,
        deletedAt: new Date().toISOString()
      },
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
  // Utility functions
  checkBlogExists,
  validateBlogData,
  getBlogsByUserId,
  checkUserExists,
  
  // API endpoints
  addBlog,
  getAllBlogs,
  getOneBlog,
  getBlogsByUser,
  updateBlog,
  deleteBlog,
}; 