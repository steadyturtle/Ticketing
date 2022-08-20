import express from 'express'
const router = express.Router()

router.get('/api/users/currentuser',(req,res)=>{
    res.status(200).json({message:"hi there"})
})

export {router as currentUserRouter}