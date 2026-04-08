import { HydratedDocument } from 'mongoose';

import {Router} from 'express'
import type {  Request , Response , NextFunction } from 'express'
import { successResponse } from '../../common/response'
const router = Router()
import userService from "../user/user.service";
import { authentication, authorization, endPoints } from '../../middleware';
import { IUser } from '../../common/interfaces';
router.get('/' ,authentication() , authorization(endPoints.profile) , 
    async(req:Request , res:Response , next:NextFunction)=>{

    const data = await userService.profile(req.user as HydratedDocument<IUser>);
    return successResponse({res , data })
})




export default router 


