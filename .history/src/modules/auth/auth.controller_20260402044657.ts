
import { Router } from "express"; 
import type { Request , Response , Router as RouterType } from "express";
import AuthService from "./auth.service";
const router: RouterType = Router()


router.post('/login' , (req:Request , res:Response )=>{
    const result = A({})
    res.send( result )

})


export default router
