import { v2 as cloudinary } from 'cloudinary';

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

/**
 * Uploads a file buffer directly to Cloudinary
 * @param buffer File buffer to upload
 * @param folder Folder destination in Cloudinary (e.g. 'gaadiwala/vehicles')
 */
export const uploadBufferToCloudinary = (buffer: Buffer, folder: string): Promise<string> => {
    return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
            {
                folder: folder,
                resource_type: 'auto',
                transformation: [
                    { width: 1200, height: 800, crop: 'limit' },
                    { quality: 'auto' }
                ]
            },
            (error, result) => {
                if (error) {
                    reject(error);
                } else {
                    resolve(result?.secure_url || '');
                }
            }
        );
        uploadStream.end(buffer);
    });
};

/**
 * Deletes an image from Cloudinary by its URL
 * @param imageUrl The full secure URL of the Cloudinary image
 */
export const deleteFromCloudinary = async (imageUrl: string) => {
    try {
        if (!imageUrl) return;
        // Extract public_id from Cloudinary URL
        // URL format: https://res.cloudinary.com/cloud_name/image/upload/v123/folder/filename.jpg
        const urlParts = imageUrl.split('/');
        const publicIdWithExt = urlParts.slice(-2).join('/');
        const publicId = publicIdWithExt.split('.')[0];
        
        await cloudinary.uploader.destroy(publicId);
        console.log('✅ Deleted image from Cloudinary:', publicId);
    } catch (error: any) {
        console.error('⚠️ Error deleting image from Cloudinary:', error.message);
    }
};

export default cloudinary;
