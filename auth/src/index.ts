import express from 'express'
import 'express-async-errors'
//import {json} from 'body-parser'
import { currentUserRouter } from './router/current-user';
import { signInRouter } from './router/signin';
import { signOutRouter } from './router/signout';
import { signupRouter } from './router/signup';
import { errorHandler } from './middleware/error-handler';
import { notFoundError } from './error/not-found-error';
const app = express();
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.use(currentUserRouter)
app.use(signInRouter)
app.use(signOutRouter)
app.use(signupRouter)

app.all("*", async()=>{
    throw new notFoundError()
})
app.use(errorHandler)

app.listen(3003,()=>{
    console.log('Listening to port 3003!!!')
})
