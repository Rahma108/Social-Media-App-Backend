import { Router } from "express"; 
import type { Request , Response , Router as RouterType } from "express";
const router: RouterType = Router()


router.post('/login' , (req:Request , res:Response )=>{
    const 
    res.send("Login Successful  ")

})


export default router
