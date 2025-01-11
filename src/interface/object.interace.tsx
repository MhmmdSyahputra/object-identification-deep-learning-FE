export interface DataResponse {
  confidence_score: number;
  entity: string;
  url?: string;
}
export interface ApiResponseImage {
  data: DataResponse;
  error: string | null;
  is_success: boolean;
}

export interface ApiResponseVideo {
  data: { frames: DataResponse[] };
  error: string | null;
  is_success: boolean;
}
