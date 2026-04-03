import { Router } from "express"; 
import type { Request , Response , Router as RouterType } from "express";
import { login } from "./auth.service";
const router: RouterType = Router()


router.post('/login' , (req:Request , res:Response )=>{
    const result = login(req.body)
    res.send("Login Successful  " , )

})


export default router
