class apiResponse {
  statusCode: number;
  success: boolean;
  data: Record<string, any>;
  message: string;
  constructor(
    statusCode: number,
    success: boolean,
    data: Record<string, any>,
    message: string = "Successfull"
  ) {
    (this.statusCode = statusCode), (this.success = statusCode < 400);
    (this.message = message), (this.data = data);
  }
}
