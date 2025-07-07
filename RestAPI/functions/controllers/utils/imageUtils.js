const { bucket } = require('../../config/firebase');

const deleteImageUtil = async (imageUrl) => {
    if (!imageUrl || typeof imageUrl !== 'string') {
        console.error("Invalid imageUrl provided for deletion.");
        return false;
    }
    try {
        const decodedUrl = decodeURIComponent(imageUrl);
        const pathStartIndex = decodedUrl.indexOf('/o/');
        if (pathStartIndex === -1) {
            console.error("Could not determine file path from imageUrl:", imageUrl);
            return false;
        }
        const filename = decodedUrl.substring(pathStartIndex + 3).split('?')[0];
        
        if (!filename) {
            console.error("Empty filename derived from imageUrl:", imageUrl);
            return false;
        }

        await bucket.file(filename).delete();
        console.log(`Successfully deleted ${filename} from storage.`);
        return true;
    } catch (error) {
        if (error.code === 404) {
            console.warn(`File not found in storage, could not delete: ${error.message}`);
        } else {
            console.error(`Error deleting image from storage: ${error.message}`);
        }
        return false;
    }
};

const deleteMultipleImagesUtil = async (imageUrls) => {
    if (!imageUrls || !Array.isArray(imageUrls)) {
        return false;
    }
    try {
        const deletePromises = imageUrls.map(url => deleteImageUtil(url));
        const results = await Promise.all(deletePromises);
        return results.every(result => result === true);
    } catch (error) {
        console.error("Error in deleteMultipleImagesUtil:", error);
        return false;
    }
};

module.exports = {
    deleteImageUtil,
    deleteMultipleImagesUtil,
};
