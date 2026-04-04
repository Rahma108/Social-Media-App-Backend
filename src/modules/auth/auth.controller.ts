
import { Router } from "express"; 
import type { NextFunction, Request , Response , Router as RouterType } from "express";
import AuthService from "./auth.service";
import { ILoginResponse, ISignupResponse } from "./auth.interface";
import { successResponse } from "../../common/response";
import { BadRequestException } from "../../common/exception";
import {  LoginSchema, SignupSchema } from "./auth.validation";
import { validation } from "../../middleware";
const router: RouterType = Router()
router.post('/login'  , validation(LoginSchema), ( req:Request , res:Response , next:NextFunction )=>{
    try {
        const result = AuthService.login(req.body)
        return successResponse<ILoginResponse>({res , status:200 , data : result })

    } catch (error) {
        throw new  BadRequestException("Invalid Body ❌" , {error: JSON.parse(error as string )  } )
    }
})

router.post('/signup' ,validation(SignupSchema) , async(req:Request , res:Response  , next:NextFunction)=>{
    try {
        await AuthService.signup(req.body)
        return successResponse<ISignupResponse>({res , status:201 })

    } catch (error) {
        throw new  BadRequestException("Invalid Body ❌" , {error: JSON.parse(error as string )  } )
    }
})
export default router
