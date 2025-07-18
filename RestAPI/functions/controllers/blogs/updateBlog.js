const { dataConnect } = require("../../config/firebase.js");
const { getOneBlogByBlogId } = require("./getBlogs.js");
const { deleteImageUtil } = require("../utils/imageUtils.js");

const updateBlog = async (req, res) => {
    try {
        const { blogId, title, content, isActive, imageUrl, deleteOldImage } = req.body;

        if (!blogId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "blogId is required" 
            });
        }

        const blog = await getOneBlogByBlogId(blogId);
        if (!blog) {
            return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: `Blog with ID ${blogId} does not exist` 
            });
        }

        if (deleteOldImage && blog.imageUrl) {
            await deleteImageUtil(blog.imageUrl).catch(err => console.error("Failed to delete old image:", err));
        }

        const UPDATE_BLOG_MUTATION = `
            mutation UpdateBlog($blogId: String!, $title: String, $content: String, $imageUrl: String, $isActive: Boolean) {
                blog_update(key: {id: $blogId}, data: {title: $title, content: $content, imageUrl: $imageUrl, isActive: $isActive, updatedAt_expr: "request.time"})
            }
        `;

        const variables = {
            blogId,
            title: title || blog.title,
            content: content || blog.content,
            imageUrl: imageUrl !== undefined ? imageUrl : blog.imageUrl,
            isActive: isActive !== undefined ? isActive : blog.isActive
        };

        await dataConnect.executeGraphql(UPDATE_BLOG_MUTATION, { variables });

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Blog updated successfully",
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
