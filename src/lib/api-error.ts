/**
 * Use this class for expose-able facing errors and to pass information to `withErrorHandling` function.
 */
export default class ApiError<DetailType = undefined> extends Error {
  name: string;
  statusCode: number;
  detail?: DetailType;

  constructor(message: string, statusCode: number, detail?: DetailType) {
    super();
    this.name = "ApiError";
    this.message = message;
    this.statusCode = statusCode;
    this.detail = detail;
  }
}
