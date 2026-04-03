import { AuthService } from './../../../.history/src/modules/auth/auth.service_20260402044348';
import { Router } from "express"; 
import type { Request , Response , Router as RouterType } from "express";
import AuthServicefrom "./auth.service";
const router: RouterType = Router()


router.post('/login' , (req:Request , res:Response )=>{
    const result = login({})
    res.send( result )

})


export default router
