import { CustomError } from "./custom-error";

export class DatabaseConnectionError extends CustomError{
    statusCode = 500;
    reason = "Internal Server error"
    constructor(){
        super("Internal Server Error")

        //as we extends the default class
        Object.setPrototypeOf(this,DatabaseConnectionError.prototype)
    }

    serializeErrors(){
        return [
            {message: this.reason}
        ]
    }
}