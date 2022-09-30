import { Response, Request, NextFunction } from "express";
import { RequestValidationError } from "../error/request-validation-error";
import { DatabaseConnectionError } from "../error/database-connection-error";
import { CustomError } from "../error/custom-error";
export const errorHandler = (
  err: Error,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof CustomError) {
    console.log("here : ", err.serializeErrors());
    return res.status(err.statusCode).send({ errors: err.serializeErrors() });
  }
  // if(err instanceof DatabaseConnectionError){
  //     return res.status(err.statusCode).send({errors:{message: err.serializeErrors()}})
  // }
  res.status(500).send({ errors: { message: "Something went wrong" } });
};
