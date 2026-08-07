import { v2 as cloudinary } from 'cloudinary';
import { ApiError } from '@inventory/shared';

// Configure Cloudinary from Environment Variables
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

/**
 * Upload Image Buffer to Cloudinary
 */
export const uploadImageToCloudinary = (fileBuffer: Buffer, _originalname?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
    const apiKey = process.env.CLOUDINARY_API_KEY;
    const apiSecret = process.env.CLOUDINARY_API_SECRET;

    // If Cloudinary keys are missing in local dev, provide a clean base64 data URI fallback
    if (!cloudName || !apiKey || !apiSecret) {
      const base64Image = `data:image/png;base64,${fileBuffer.toString('base64')}`;
      return resolve(base64Image);
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'inventory-management/products',
        resource_type: 'image',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
      },
      (error, result) => {
        if (error || !result) {
          return reject(ApiError.badRequest(`Cloudinary upload failed: ${error?.message || 'Unknown error'}`));
        }
        resolve(result.secure_url);
      }
    );

    uploadStream.end(fileBuffer);
  });
};

/**
 * Delete Image from Cloudinary using Image URL
 */
export const deleteImageFromCloudinary = async (imageUrl: string | null | undefined): Promise<void> => {
  if (!imageUrl || !imageUrl.includes('res.cloudinary.com')) {
    return;
  }

  try {
    const urlParts = imageUrl.split('/');
    const uploadIndex = urlParts.indexOf('upload');
    if (uploadIndex === -1) return;

    const publicIdParts = urlParts.slice(uploadIndex + 1);
    if (publicIdParts[0] && publicIdParts[0].startsWith('v')) {
      publicIdParts.shift();
    }

    const publicIdWithExt = publicIdParts.join('/');
    const publicId = publicIdWithExt.substring(0, publicIdWithExt.lastIndexOf('.')) || publicIdWithExt;

    if (publicId) {
      await cloudinary.uploader.destroy(publicId);
    }
  } catch (error) {
    console.error('Failed to delete image from Cloudinary:', error);
  }
};
