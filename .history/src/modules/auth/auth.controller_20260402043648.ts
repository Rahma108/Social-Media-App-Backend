import { Router } from "express"; 
import type {}
const router = Router()


router.post('/login' , (req:Request , res:Response )=>{
    res.send("Login Successful  ")

})


export default router
