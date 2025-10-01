import { NextResponse } from "next/server";

export type ErrorDetail<T> = {
  message: string;
  detail?: T;
};

export type ErrorApiResponse<T = undefined> = {
  success: false;
  error: ErrorDetail<T>;
};

export type SuccessApiResponse<T = undefined> = {
  success: true;
  data: T;
};

export type ApiResponse<T> = ErrorApiResponse | SuccessApiResponse<T>;

export function createSuccessResponse<T>(data: T, status: number = 200) {
  return NextResponse.json<SuccessApiResponse<T>>(
    {
      success: true,
      data,
    },
    { status },
  );
}
export function createErrorResponse<T>(error: ErrorDetail<T>, status: number) {
  return NextResponse.json<ErrorApiResponse<T>>(
    {
      success: false,
      error,
    },
    { status },
  );
}
