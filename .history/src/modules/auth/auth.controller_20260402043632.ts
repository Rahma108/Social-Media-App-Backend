import { Router } from "express"; 

const router = Router()


router.post('/login' , (req:Request , res )=>{
    res.send("Login Successful  ")

})


export default router
