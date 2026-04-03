import type { NextFunction, Request, Response } from "express"

interface IError {

    cause:{
        statusCode:number
    }

}

export const globalErrorHandler = (err: IError  , req:Request , res:Response , next:NextFunction )=>{
        console.log(err)
        
        res.status( (err.cause?.statusCode  as unknown as  number )|| 500 ).json({
            message:err.message || "Internal Server Error" ,
            stack:err.stack ,
            error : err.message
        })


}