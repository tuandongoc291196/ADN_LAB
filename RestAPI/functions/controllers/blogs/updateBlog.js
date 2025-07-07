const { dataConnect } = require("../../config/firebase.js");
const { checkBlogExists } = require("./blogUtils.js");
const { getOneBlogByBlogId } = require("./getBlogs.js");
const { deleteImageUtil } = require("../utils/imageUtils.js");
const { bucket } = require("../../config/firebase.js");
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');

const updateBlog = async (req, res) => {
    try {
        let imageUrls = [];
        let formData = {};
        const uploads = [];
        
        const busboy = Busboy({ headers: req.headers });

        busboy.on('field', (fieldname, value) => {
            formData[fieldname] = value;
        });

        busboy.on('file', (fieldname, file, { filename, encoding, mimetype }) => {
            if (!mimetype.startsWith('image/')) {
                file.resume();
                return;
            }

            const extension = path.extname(filename);
            const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
            const blogIdForFilename = formData.blogId || 'TEMP_BLOG_ID'; 
            const finalFilename = `${blogIdForFilename}_IMAGE_${timestamp}${extension}`;
            const filepath = path.join(os.tmpdir(), finalFilename);
            
            const writeStream = fs.createWriteStream(filepath);
            file.pipe(writeStream);

            const uploadPromise = new Promise((resolve, reject) => {
                file.on('end', () => {
                    bucket.upload(filepath, {
                        destination: `blogs/${finalFilename}`,
                        metadata: { contentType: mimetype }
                    }).then(data => {
                        const uploadedFile = data[0];
                        const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(uploadedFile.name)}?alt=media`;
                        fs.unlink(filepath, (err) => {
                            if (err) console.error('Error deleting temp file:', err);
                        });
                        resolve(url);
                    }).catch(err => {
                        fs.unlink(filepath, () => {});
                        reject(err);
                    });
                });
                file.on('error', (error) => reject(error));
            });
            uploads.push(uploadPromise);
        });

        await new Promise((resolve, reject) => {
            req.pipe(busboy);
            busboy.on('finish', () => {
                Promise.all(uploads)
                    .then(urls => {
                        imageUrls = urls;
                        resolve();
                    })
                    .catch(reject);
            });
            busboy.on('error', reject);
        });
        
        const { blogId, title, content, status } = formData;
    
        if (!blogId) {
            return res.status(400).json({
                statusCode: 400,
                status: "error",
                message: "blogId is required",
            });
        }
    
        const blog = await getOneBlogByBlogId(blogId);
        if (!blog) {
             return res.status(404).json({
                statusCode: 404,
                status: "error",
                message: `Blog with ID ${blogId} does not exist`,
            });
        }

        let finalImageUrl = blog?.imageUrl || null;
        
        if (imageUrls.length > 0) {
            if (blog && blog.imageUrl) {
                await deleteImageUtil(blog.imageUrl);
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
            title: title || blog.title,
            content: content || blog.content,
            imageUrl: finalImageUrl,
            status: status || blog.status
        };

        const response = await dataConnect.executeGraphql(UPDATE_BLOG_MUTATION, {
            variables: variables,
        });

        res.status(200).json({
            statusCode: 200,
            status: "success",
            message: "Blog updated successfully",
            data: response.data,
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
