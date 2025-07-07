const { dataConnect } = require("../../config/firebase.js");
const { checkBlogExists } = require("./blogUtils.js");
const { checkUserExists } = require("../users/userUtils.js");
const { getRoleByUserId } = require("../roles/getRoles.js");
const { randomAlphanumeric } = require("../utils/utilities.js");
const { bucket } = require("../../config/firebase.js");
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');

const addBlog = async (req, res) => {
  try {
    let imageUrls = [];
    let formData = {};
    const uploads = [];
    
    console.log('Request headers:', req.headers);
    
    const busboy = Busboy({ headers: req.headers });

    // Generate blog ID first
    const randomNumbers = await randomAlphanumeric(6, 6);
    const id = `ADNBLOG${randomNumbers}`;
    
    // Handle form fields
    busboy.on('field', (fieldname, value) => {
      console.log('Received field:', fieldname, value);
      formData[fieldname] = value;
    });

    // Handle file uploads
    busboy.on('file', (fieldname, file, fileInfo) => {
      console.log('Processing file:', fieldname, fileInfo);
      
      if (!fileInfo.mimetype.startsWith('image/')) {
        console.log('Invalid file type:', fileInfo.mimetype);
        file.resume();
        return;
      }

      const extension = path.extname(fileInfo.filename);
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const finalFilename = `${id}_IMAGE_${timestamp}${extension}`;
      const filepath = path.join(os.tmpdir(), finalFilename);
      console.log('Writing file to:', filepath);
      
      const writeStream = fs.createWriteStream(filepath);
      
      file.pipe(writeStream);

      const uploadPromise = new Promise((resolve, reject) => {
        file.on('end', () => {
          console.log('File write completed:', filepath);
          
          bucket.upload(filepath, {
            destination: `blogs/${finalFilename}`,
            metadata: {
              contentType: fileInfo.mimetype
            }
          }).then(data => {
            const file = data[0];
            const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
            console.log('File uploaded successfully:', url);
            
            fs.unlink(filepath, (err) => {
              if (err) console.error('Error deleting temp file:', err);
            });
            
            resolve(url);
          }).catch(err => {
            console.error('Error uploading file to bucket:', err);
            fs.unlink(filepath, (unlinkErr) => {
              if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
            });
            reject(err);
          });
        });

        file.on('error', (error) => {
          console.error('Error processing file:', error);
          reject(error);
        });
      });
      uploads.push(uploadPromise);
    });
    
    const parseFormData = new Promise((resolve, reject) => {
      busboy.on('finish', () => {
        console.log('Busboy finished processing');
        Promise.all(uploads)
          .then(urls => {
            console.log('All files uploaded:', urls);
            imageUrls = urls;
            resolve();
          })
          .catch(err => {
            console.error('Error in file uploads:', err);
            reject(err);
          });
      });
      
      busboy.on('error', (error) => {
        console.error('Busboy error:', error);
        reject(error);
      });
      
      // Pipe the request directly to busboy instead of using rawBody
      req.pipe(busboy);
    });
    
    await parseFormData;
    
    const { userId, title, content, status } = formData;

    if (!userId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "userId is required",
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

    if (!(await checkUserExists(userId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "User not found",
      });
    }

    const userRole = await getRoleByUserId(userId);
    if (!userRole || userRole.id !== "3") {
      return res.status(403).json({
        statusCode: 403,
        status: "error",
        message: "User does not have permission to create blogs",
      });
    }

    if (await checkBlogExists(id)) {
      return res.status(409).json({
        statusCode: 409,
        status: "error",
        message: "Blog with this ID already exists",
      });
    }

    if (imageUrls.length === 0) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "At least one image is required",
      });
    }

    const CREATE_BLOG_MUTATION = `
      mutation CreateBlog($id: String!, $userId: String!, $title: String!, $content: String!, $imageUrl: String, $status: String) @auth(level: USER) {
        blog_insert(data: {id: $id, userId: $userId, title: $title, content: $content, imageUrl: $imageUrl, status: $status})
      }
    `;

    const variables = {
      id: id,
      userId: userId,
      title: title,
      content: content,
      imageUrl: imageUrls[0],
      status: status || "DRAFT"
    };

    console.log("Executing GraphQL mutation:", CREATE_BLOG_MUTATION, "with variables:", variables);
    const response = await dataConnect.executeGraphql(CREATE_BLOG_MUTATION, {
      variables : variables,
    });

    const responseData = response.data;
    console.log("Response data:", responseData);
    
    res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Blog created successfully",
      data: responseData,
    });
  } catch (error) {
    console.error("Error creating blog:", error);
    if (error.message && error.message.includes('duplicate key value violates unique constraint')) {
      return res.status(409).json({
        statusCode: 409,
        status: "error",
        message: "Blog with this ID already exists",
        error: error.message,
      });
    }

    if (error.codePrefix === 'data-connect' && error.errorInfo) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Database operation failed",
        error: error.message,
      });
    }

    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to create blog",
      error: error.message,
    });
  }
};

module.exports = {
  addBlog,
};