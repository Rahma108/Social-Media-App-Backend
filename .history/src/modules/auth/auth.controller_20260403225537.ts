
import { Router } from "express"; 
import type { Request , Response , Router as RouterType } from "express";
import AuthService from "./auth.service";
import { successResponse } from "../../common/response/success.response";
import { ISignupResponse } from "./auth.interface";
const router: RouterType = Router()


router.post('/login' , (req:Request , res:Response )=>{
    const result = AuthService.login(req.body )
    successResponse<I>({res  , data:result})

})

router.post('/signup' , (req:Request , res:Response )=>{
    const result = AuthService.signup(req.body)
    successResponse<ISignupResponse>({res , status:201 , data : result })

})
export default router
