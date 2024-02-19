import { Request, Response, NextFunction } from "express";
import { StatusCodes } from "http-status-codes";
import { BadRequestError, NotFoundError, UnauthorizedError } from "./errors";

const errorMiddleware = (
  error: Error | BadRequestError | NotFoundError | UnauthorizedError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let statusCode;

  if (error instanceof BadRequestError) {
    statusCode = StatusCodes.BAD_REQUEST;
  } else if (error instanceof NotFoundError) {
    statusCode = StatusCodes.NOT_FOUND;
  } else if (error instanceof UnauthorizedError) {
    statusCode = StatusCodes.UNAUTHORIZED;
  } else {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
  }

  if (typeof error.message == "string" && error.message.includes("\nInvalid")) {
    error.message = "solicitação inválida";
    statusCode = StatusCodes.BAD_REQUEST;
  }

  res.status(statusCode).json({
    message: error.message,
  });
};

export default errorMiddleware;
