const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// isme hum configuration details pass krte hai
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// we copied below code from https://www.npmjs.com/package/multer-storage-cloudinary and it is reference code we are using
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "staysphere_DEV",
    allowedFormats: ["jpg", "jpeg", "png"],
  },
});
// we gave name storage to store files

module.exports = {
  cloudinary,
  storage,
};
