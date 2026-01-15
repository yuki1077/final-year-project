const cloudinary = require('../config/cloudinary');

const uploadImage = async (fileBuffer, folder = process.env.CLOUDINARY_ASSET_FOLDER) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder,
        upload_preset: process.env.CLOUDINARY_UPLOAD_PRESET,
      },
      (error, result) => {
        if (error) return reject(error);
        resolve(result);
      }
    );

    stream.end(fileBuffer);
  });
};

module.exports = {
  uploadImage,
};

