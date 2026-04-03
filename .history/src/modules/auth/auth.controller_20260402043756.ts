import { Router } from "express"; 
import type { Request , Response , Router as RouterTp } from "express";
const router = Router()


router.post('/login' , (req:Request , res:Response )=>{
    res.send("Login Successful  ")

})


export default router
