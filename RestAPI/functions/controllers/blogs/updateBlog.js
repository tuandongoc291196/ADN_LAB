const { dataConnect } = require("../../config/firebase.js");
const { checkBlogExists } = require("./blogUtils.js");
const { getOneBlogByBlogId } = require("./getBlogs.js");
const {deleteImageUtil, uploadMultipleImagesUtil} = require("../utils/imageUtils.js");
const Busboy = require('busboy');

const updateBlog = async (req, res) => {
    try {
        let imageUrls = [];
        let formData = {};
        
        const busboy = Busboy({ headers: req.headers });
        
        const parseFormData = new Promise((resolve, reject) => {
            busboy.on('field', (fieldname, value) => {
                formData[fieldname] = value;
            });
            
            busboy.on('finish', () => {
                resolve();
            });
            
            busboy.on('error', (error) => {
                reject(error);
            });
            
            busboy.end(req.rawBody);
        });
        
        await parseFormData;
        
        const { blogId, title, content, status } = formData;
    
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

        if (!title) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "title is required",
            });
        }

        if (!content) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "content is required",
            });
        }

        if (!status) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "status is required",
            });
        }

        const blog = await getOneBlogByBlogId(blogId);
        
        try {
            imageUrls = await uploadMultipleImagesUtil(req, 'blogs', blogId);
        } catch (imageError) {
            console.log("No images uploaded or image upload failed:", imageError.message);
        }

        let finalImageUrl = blog?.imageUrl || null;
        
        if (imageUrls.length > 0) {
            if (blog && blog.imageUrl) {
                const imageDeleted = await deleteImageUtil(blog.imageUrl);
                if (!imageDeleted) {
                    console.warn(`Failed to delete old image for blog ${blogId}: ${blog.imageUrl}`);
                } else {
                    console.log(`Successfully deleted old image for blog ${blogId}: ${blog.imageUrl}`);
                }
            }
            finalImageUrl = imageUrls[0];
        }

        const UPDATE_BLOG_MUTATION = `
            mutation UpdateBlog($blogId: String!, $title: String, $content: String, $imageUrl: String, $status: String) @auth(level: USER) {
                blog_update(key: {id: $blogId}, data: {title: $title, content: $content, imageUrl: $imageUrl, status: $status, updatedAt_expr: "request.time"})
            }
        `;

        const variables = {
            blogId: blogId,
            title: title,
            content: content,
            imageUrl: finalImageUrl,
            status: status || "DRAFT"
        };

        console.log("Executing GraphQL mutation:", UPDATE_BLOG_MUTATION, "with variables:", variables);
        const response = await dataConnect.executeGraphql(UPDATE_BLOG_MUTATION, {
            variables: variables,
        });

        const responseData = response.data;
        console.log("Response data:", responseData);
        
        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Blog updated successfully",
            data: responseData,
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
