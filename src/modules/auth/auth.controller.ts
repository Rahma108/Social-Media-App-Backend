
import { Router } from "express"; 
import type { NextFunction, Request , Response , Router as RouterType } from "express";
import AuthService from "./auth.service";
import { successResponse } from "../../common/response";
import { IUser } from "../../common/interfaces";
import * as validators from './auth.validation'
import { validation } from "../../middleware";
import { ILoginResponse } from "./auth.interface";

const router: RouterType = Router()
router.post('/login', validation(validators.LoginSchema), async( req:Request , res:Response , next:NextFunction )=>{
    try {
        const result = await AuthService.login(req.body , `${req.protocol}://${req.host}`)
        return successResponse<ILoginResponse>({res , data : result })

    } catch (error) {
        throw  error
    }
})
router.patch('/confirm-email' ,  validation(validators.confirmEmailSchema) , async(req:Request , res:Response , next:NextFunction): Promise<Response>=>{
    try {
        await AuthService.confirmEmail(req.body)
        return successResponse({res})
    } catch (error) {
        throw error
    }
})

router.patch('/resend-confirm-email' ,  validation(validators.resendConfirmEmailSchema) , async(req:Request , res:Response , next:NextFunction ): Promise<Response>=>{
    try {
        await AuthService.reSendConfirmEmail(req.body)
        return successResponse({res})
    } catch (error) {
        throw error
    }
})
router.post('/signup' ,validation(validators.SignupSchema) , async(req:Request , res:Response  , next:NextFunction)=>{
    try {
        const result = await AuthService.signup(req.body)
        return successResponse<IUser>({res , status:201  , data: result})
    } catch (error) {
        throw error
    }
})
export default router
