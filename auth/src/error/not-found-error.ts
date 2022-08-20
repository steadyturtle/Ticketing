import { CustomError } from "./custom-error";


export class notFoundError extends CustomError{
    statusCode =  404;
    constructor(){
        super("Route related Error");
        Object.setPrototypeOf(this,notFoundError.prototype)
    }
    serializeErrors() {
        return [{message:'Not Found'}]
    }
}