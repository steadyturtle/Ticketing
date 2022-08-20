import express,{Request,Response} from 'express'
import {body,validationResult} from 'express-validator'
const router = express.Router()

//router.get('/api/users/currentuser',(req,res)=>res.send('hi there'))
router.post('/api/users/signin',[
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
        console.log('errors ',errors)
        res.status(400).send(errors.array())
    }
    console.log("Creating user...")
    res.send({})
})
export {router as signInRouter}