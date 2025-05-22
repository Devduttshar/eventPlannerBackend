const cloudinary = require('cloudinary').v2;
const streamifier = require('streamifier');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (file) => {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      {
        folder: 'events',
        crop: 'scale'
      },
      (error, result) => {
        if (result) {
          resolve({
            public_id: result.public_id,
            url: result.secure_url
          });
        } else {
          reject(error);
        }
      }
    );
    streamifier.createReadStream(file.buffer).pipe(stream);
  });
};

const deleteFromCloudinary = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    throw new Error('Error deleting image from Cloudinary');
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };
