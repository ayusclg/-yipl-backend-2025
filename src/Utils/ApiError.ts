export class apiError extends Error {
  statusCode: number;
  stack?: string;
  message: string;
  success: boolean;

  constructor(
    statusCode: number,
    stack: string,
    message: string = "Something Went Wrong",
    success: boolean
  ) {
    super(message);
    (this.statusCode = statusCode),
      (this.success = false),
      (this.message = message),
      stack
        ? (this.stack = stack)
        : Error.captureStackTrace(this, this.constructor);
  }
}
