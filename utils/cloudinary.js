const cloudinary = require('cloudinary').v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const uploadToCloudinary = async (file) => {
  try {
    const result = await cloudinary.uploader.upload(file.path, {
      folder: 'events',
      crop: 'scale'
    });
    console.log('result',result);
    return {
      public_id: result.public_id,
      url: result.secure_url
    };
  } catch (error) {
    cosnole.log('error',error);
    throw new Error('Error uploading image to Cloudinary');
  }
};

const deleteFromCloudinary = async (public_id) => {
  try {
    await cloudinary.uploader.destroy(public_id);
  } catch (error) {
    throw new Error('Error deleting image from Cloudinary');
  }
};

module.exports = { uploadToCloudinary, deleteFromCloudinary };