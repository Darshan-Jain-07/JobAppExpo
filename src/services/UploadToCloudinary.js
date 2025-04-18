// import { CLOUDINARY_API_URL, CLOUDINARY_UPLOAD_PRESET } from "@env";
import axios from "axios";
const CLOUDINARY_API_URL = "https://api.cloudinary.com/v1_1/dwnqftgj0/image/upload";
const CLOUDINARY_UPLOAD_PRESET = "jobApp";

export default uploadToCloudinary = async (file) => {
  const apiUrl = CLOUDINARY_API_URL;
  const data = {
    file,
    upload_preset: CLOUDINARY_UPLOAD_PRESET,
  };
  try {
    const result = await axios.post(apiUrl, {
      ...data,
    });
    const media = result.data.secure_url;
    if (media) {
      return media;
    }
  } catch (error) {
    // log error
  }
};