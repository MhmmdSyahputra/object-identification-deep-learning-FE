import axios from "axios";

export interface ApiResponse {
  data: string | null;
  error: string | null;
  is_success: boolean;
}
const apiUrl = import.meta.env.VITE_API_URL;

export const uploadImage = async (file: File): Promise<ApiResponse> => {
  try {
    const response = await axios.post<ApiResponse>(
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
