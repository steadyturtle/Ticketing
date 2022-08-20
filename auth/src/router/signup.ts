import express,{Request,Response} from 'express'
import {body,validationResult} from 'express-validator'
import { RequestValidationError } from '../error/request-validation-error'
import { DatabaseConnectionError } from '../error/database-connection-error'
const router = express.Router()

//router.get('/api/users/currentuser',(req,res)=>res.send('hi there'))
router.post('/api/users/signup',[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({min: 4, max: 20})
        .withMessage('Password must be between 4 and 20 characters')
],(req:Request,res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.array())
    }
    console.log("Creating user...")
    throw new DatabaseConnectionError()
})
export {router as signupRouter}