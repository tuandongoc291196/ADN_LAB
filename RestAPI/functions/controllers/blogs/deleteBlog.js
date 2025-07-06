const { dataConnect } = require("../../config/firebase.js");
const {checkBlogExists} = require("./blogUtils.js");
const {getOneBlogByBlogId} = require("./getBlogs.js");
const {deleteImageUtil} = require("../utils/imageUtils.js");

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
        message: `Blog with ID ${blogId} does not exist`,
      });
    }

    const blog = await getOneBlogByBlogId(blogId);

    if (blog && blog.imageUrl) {
      const imageDeleted = await deleteImageUtil(blog.imageUrl);
      if (!imageDeleted) {
        console.warn(`Failed to delete image for blog ${blogId}: ${blog.imageUrl}`);
      } else {
        console.log(`Successfully deleted image for blog ${blogId}: ${blog.imageUrl}`);
      }
    }

    const DELETE_BLOG_MUTATION = `
      mutation DeleteBlog($blogId: String!) @auth(level: USER) {
        blog_delete(key: {id: $blogId})
      }
    `;

    const variables = {
      blogId: blogId,
    };

    console.log("Executing GraphQL mutation:", DELETE_BLOG_MUTATION, "with variables:", variables);
    
    const response = await dataConnect.executeGraphql(DELETE_BLOG_MUTATION, {
      variables: variables,
    });
    
    console.log("Response from GraphQL:", response);

    res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Blog deleted successfully",
      data: response.data,
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