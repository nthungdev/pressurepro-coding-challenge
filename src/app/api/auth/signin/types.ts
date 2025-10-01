import type { ApiResponse } from "@/lib/api-response";

export type SignInPostResponseData = {
  id: string;
  email: string;
};

export type SignInPostResponse = ApiResponse<SignInPostResponseData>;
