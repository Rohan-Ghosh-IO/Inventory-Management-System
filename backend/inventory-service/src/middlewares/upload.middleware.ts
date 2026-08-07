import multer from 'multer';
import { ApiError } from '@inventory/shared';

const storage = multer.memoryStorage();

const fileFilter = (_req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
  const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];

  if (allowedMimeTypes.includes(file.mimetype.toLowerCase())) {
    cb(null, true);
  } else {
    cb(new ApiError(400, 'Invalid file format. Only JPG, JPEG, PNG, and WEBP image formats are supported.'));
  }
};

export const uploadProductImageMiddleware = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5 MB max
  },
  fileFilter,
}).single('image');
