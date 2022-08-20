import { ValidationError } from "express-validator"
import { CustomError } from "./custom-error";
export class RequestValidationError extends CustomError{
    statusCode = 400;
    constructor(public error: ValidationError[]){
        super("Bad Request")

        //as we extends the default class
        Object.setPrototypeOf(this,RequestValidationError.prototype)
    }

    serializeErrors(){
        return this.error.map(err=>({message:err.msg,field:err.param}))
    }
}