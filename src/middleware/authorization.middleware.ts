import { ForbiddenException } from "../common/exception"
import type { NextFunction, Request, Response } from "express"

export const authorization =  ( accessRoles = [] )=>{
    return async  (req: Request, res: Response, next: NextFunction )=>{
            if(!accessRoles.includes(req.user.role)){
                throw new ForbiddenException("Not allowed account !")
            }
            
            next()
        

    }
}