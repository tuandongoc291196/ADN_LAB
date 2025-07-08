const { bucket } = require('../../config/firebase');
const Busboy = require('busboy');
const path = require('path');
const os = require('os');
const fs = require('fs');

const uploadSingleImageUtil = (req, folder = 'images', id = null, maxSizeInMB = 5) => {
    return new Promise((resolve, reject) => {
        const busboy = Busboy({ 
            headers: req.headers,
            limits: {
                fileSize: maxSizeInMB * 1024 * 1024
            }
        });
        let imageUrl = '';

        busboy.on('file', (fieldname, file, { filename, encoding, mimetype }) => {
            if (!mimetype.startsWith('image/')) {
                file.resume();
                return reject(new Error('Only image files are allowed'));
            }

            let finalFilename = filename;
            if (id) {
                const extension = path.extname(filename);
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                finalFilename = `${id}_IMAGE_${timestamp}${extension}`;
            }
            
            const filepath = path.join(os.tmpdir(), finalFilename);
            const writeStream = fs.createWriteStream(filepath);
            
            let fileSize = 0;
            
            file.on('data', (chunk) => {
                fileSize += chunk.length;
                if (fileSize > maxSizeInMB * 1024 * 1024) {
                    file.destroy();
                    writeStream.destroy();
                    fs.unlink(filepath, () => {});
                    return reject(new Error(`File size exceeds ${maxSizeInMB}MB limit`));
                }
            });
            
            file.pipe(writeStream);

            file.on('end', () => {
                bucket.upload(filepath, {
                    destination: `${folder}/${finalFilename}`,
                    metadata: {
                        contentType: mimetype
                    }
                }).then((data) => {
                    const file = data[0];
                    imageUrl = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
                    
                    fs.unlink(filepath, (err) => {
                        if (err) console.error('Error deleting temp file:', err);
                    });
                    
                    resolve(imageUrl);
                }).catch(err => {
                    fs.unlink(filepath, (unlinkErr) => {
                        if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
                    });
                    reject(err);
                });
            });

            file.on('error', (error) => {
                reject(error);
            });
        });

        busboy.on('filesLimit', () => {
            reject(new Error(`File size exceeds ${maxSizeInMB}MB limit`));
        });

        busboy.on('error', (error) => {
            reject(error);
        });

        busboy.end(req.rawBody);
    });
};

const uploadMultipleImagesUtil = (req, folder = 'images', id = null, maxSizeInMB = 5) => {
    return new Promise((resolve, reject) => {
        const busboy = Busboy({ 
            headers: req.headers,
            limits: {
                fileSize: maxSizeInMB * 1024 * 1024
            }
        });
        const uploads = [];

        busboy.on('file', (fieldname, file, { filename, encoding, mimetype }) => {
            if (!mimetype.startsWith('image/')) {
                file.resume();
                return reject(new Error('Only image files are allowed'));
            }

            let finalFilename = filename;
            if (id) {
                const extension = path.extname(filename);
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                finalFilename = `${id}_IMAGE_${timestamp}${extension}`;
            }
            
            const filepath = path.join(os.tmpdir(), finalFilename);
            const writeStream = fs.createWriteStream(filepath);
            
            let fileSize = 0;
            
            file.on('data', (chunk) => {
                fileSize += chunk.length;
                if (fileSize > maxSizeInMB * 1024 * 1024) {
                    file.destroy();
                    writeStream.destroy();
                    fs.unlink(filepath, () => {});
                    return reject(new Error(`File size exceeds ${maxSizeInMB}MB limit`));
                }
            });
            
            file.pipe(writeStream);

            const uploadPromise = new Promise((uploadResolve, uploadReject) => {
                file.on('end', () => {
                    bucket.upload(filepath, {
                        destination: `${folder}/${finalFilename}`,
                        metadata: {
                            contentType: mimetype
                        }
                    }).then(data => {
                        const file = data[0];
                        const url = `https://firebasestorage.googleapis.com/v0/b/${bucket.name}/o/${encodeURIComponent(file.name)}?alt=media`;
                        
                        fs.unlink(filepath, (err) => {
                            if (err) console.error('Error deleting temp file:', err);
                        });
                        
                        uploadResolve(url);
                    }).catch(err => {
                        fs.unlink(filepath, (unlinkErr) => {
                            if (unlinkErr) console.error('Error deleting temp file:', unlinkErr);
                        });
                        uploadReject(err);
                    });
                });

                file.on('error', (error) => {
                    uploadReject(error);
                });
            });
            uploads.push(uploadPromise);
        });

        busboy.on('finish', () => {
            Promise.all(uploads)
                .then(urls => {
                    resolve(urls);
                })
                .catch(err => {
                    reject(err);
                });
        });

        busboy.on('filesLimit', () => {
            reject(new Error(`File size exceeds ${maxSizeInMB}MB limit`));
        });

        busboy.on('error', (error) => {
            reject(error);
        });

        busboy.end(req.rawBody);
    });
};

const deleteImageUtil = async (imageUrl) => {
    try {
        const decodedUrl = decodeURIComponent(imageUrl);
        const filename = decodedUrl.split('/o/')[1].split('?')[0];
        
        await bucket.file(filename).delete();
        return true;
    } catch (error) {
        return false;
    }
};

const deleteMultipleImagesUtil = async (imageUrls) => {
    try {
        const deletePromises = imageUrls.map(url => deleteImageUtil(url));
        const results = await Promise.all(deletePromises);
        return results.every(result => result === true);
    } catch (error) {
        return false;
    }
};

module.exports = {
    uploadSingleImageUtil,
    uploadMultipleImagesUtil,
    deleteImageUtil,
    deleteMultipleImagesUtil
};