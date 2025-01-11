import axios from "axios";
import { ApiResponseImage, ApiResponseVideo } from "../interface/object.interace";

const apiUrl = import.meta.env.VITE_API_URL;

export const uploadImage = async (file: File): Promise<ApiResponseImage> => {
  try {
    const response = await axios.post<ApiResponseImage>(
      `${apiUrl}/identifications/image`,
      file,
      {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Gagal mengunggah gambar. Silakan coba lagi.");
  }
};

export const uploadVideo = async (file: File): Promise<ApiResponseVideo> => {
  try {
    const response = await axios.post<ApiResponseVideo>(
      `${apiUrl}/identifications/video`,
      file,
      {
        headers: {
          "Content-Type": "application/octet-stream",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("API Error:", error);
    throw new Error("Gagal mengunggah video. Silakan coba lagi.");
  }
};
