import express,{Request,Response} from 'express'
import {body,validationResult} from 'express-validator'
import { RequestValidationError } from '../error/request-validation-error'
import { BadRequestError } from '../error/bad-request-error'
import { User } from '../model/user-model'
import jwt from 'jsonwebtoken'
const router = express.Router()

router.post('/api/users/signup',[
    body('email')
        .isEmail()
        .withMessage('Email must be valid'),
    body('password')
        .trim()
        .isLength({min: 4, max: 20})
        .withMessage('Password must be between 4 and 20 characters')
],async (req:Request,res:Response)=>{
    const errors = validationResult(req);
    if(!errors.isEmpty()){
        throw new RequestValidationError(errors.array())
    }
    const {email,password} = req.body;
    const userExist = await User.findOne({email});
    if(userExist) throw new BadRequestError("Email in use")
    
    const user = User.build({email,password})
    await user.save();
    console.log("User created.")
    //Generating JWT
   const token =  jwt.sign({id: user.id, email: user.email},'abcd')

    //store in a cookie
    req.session = {
        token
    }
    res.status(201).send(user)
})
export {router as signupRouter}