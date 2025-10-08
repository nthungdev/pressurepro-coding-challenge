import { NextResponse } from "next/server";

export type ErrorDetail<T = undefined> = {
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

export type ApiResponse<T, E = unknown> =
  | ErrorApiResponse<E>
  | SuccessApiResponse<T>;

export function createSuccessResponse<T = undefined>(
  data: T,
  status: number = 200,
) {
  return NextResponse.json<SuccessApiResponse<T>>(
    {
      success: true,
      data,
    },
    { status },
  );
}
export function createErrorResponse<T = undefined>(
  error: ErrorDetail<T>,
  status: number,
) {
  return NextResponse.json<ErrorApiResponse<T>>(
    {
      success: false,
      error,
    },
    { status },
  );
}
