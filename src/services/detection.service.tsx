import axios from "axios";

export interface DataResponse {
  confidence_score: number;
  entity: string;
}
export interface ApiResponse {
  data: DataResponse;
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
