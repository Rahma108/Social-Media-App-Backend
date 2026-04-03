import type { NextFunction, Request, Response } from "express"



export const globalErrorHandler = (err:Error , req:Request , res:Response , next:NextFunction )=>{
        console.log(err)
        const error = err.cause
        res.status( (err.cause?.statusCode  as unknown as  number )|| 500 ).json({
            message:err.message || "Internal Server Error" ,
            stack:err.stack ,
            error : err.message
        })


}