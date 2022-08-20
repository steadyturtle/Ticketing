interface errorObj{
    message:string;
    field?:string
}

export abstract class CustomError extends Error{
    abstract statusCode: number;
    constructor(message: string){
        super(message)
        //as we extends the default class
        Object.setPrototypeOf(this,CustomError.prototype)
    }
    abstract serializeErrors():errorObj[];
}