const { dataConnect } = require("../../config/firebase.js");
const { getOneBlogByBlogId } = require("./getBlogs.js");
const { deleteImageUtil } = require("../utils/imageUtils.js");

const updateBlog = async (req, res) => {
    try {
        const { blogId, title, content, status, imageUrl, deleteOldImage } = req.body;

        if (!blogId) {
            return res.status(400).json({ message: "blogId is required" });
        }

        const blog = await getOneBlogByBlogId(blogId);
        if (!blog) {
            return res.status(404).json({ message: `Blog with ID ${blogId} does not exist` });
        }

        if (deleteOldImage && blog.imageUrl) {
            await deleteImageUtil(blog.imageUrl).catch(err => console.error("Failed to delete old image:", err));
        }

        const UPDATE_BLOG_MUTATION = `
            mutation UpdateBlog($blogId: String!, $title: String, $content: String, $imageUrl: String, $status: String) {
                blog_update(key: {id: $blogId}, data: {title: $title, content: $content, imageUrl: $imageUrl, status: $status, updatedAt_expr: "request.time"})
            }
        `;

        const variables = {
            blogId,
            title: title || blog.title,
            content: content || blog.content,
            imageUrl: imageUrl !== undefined ? imageUrl : blog.imageUrl,
            status: status || blog.status
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
