import { HydratedDocument } from 'mongoose';

import {Router} from 'express'
import type {  Request , Response , NextFunction } from 'express'
import { successResponse } from '../../common/response'
const router = Router()
import userService from "../user/user.service";
import { authentication, authorization, endPoints } from '../../middleware';
import { IUser } from '../../common/interfaces';
import { TokenTypeEnum } from '../../common/enums/security.enum';
import { UnauthorizedException } from '../../common/exception';
router.get('/' ,authentication(TokenTypeEnum.access) , authorization(endPoints.profile) , 
    async(req:Request , res:Response , next:NextFunction)=>{

    const data = await userService.profile(req.user as HydratedDocument<IUser>);
    return successResponse({res , data })
})
// Logout
router.get('/rotate' , authentication(TokenTypeEnum.refresh) , async (req:Request , res:Response , next:NextFunction)=>{
    if (!req.user || !req.decoded) {
      throw new UnauthorizedException("Invalid token ❌");
    }
    const result = await  userService.rotateToken(req.user , req.decoded as {iat:number , jti:string , sub:string } ,`${req.protocol}://${req.host}`)
    return successResponse({res , data:result})
})

router.post('/logout', authentication() ,  async(req , res , next)=>{
    const status = await userService.logout(req.body.flag , req.user, req.decoded as {iat:number , jti:string , sub:string })
    return successResponse({res  , status:status  })
})


export default router 


