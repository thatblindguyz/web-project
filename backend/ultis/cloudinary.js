const dotenv = require("dotenv");
const cloudinaryModule = require("cloudinary");

dotenv.config();

console.log("Cloud name:", process.env.CLOUDINARY_CLOUD_NAME);

const cloudinary = cloudinaryModule.v2;
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

module.exports = cloudinary;
