import type { ApiResponse } from "@/lib/api-response";

export type SignUpPostResponseData = {
  id: string;
  email: string;
};

export type SignUpPostResponse = ApiResponse<SignUpPostResponseData>;
