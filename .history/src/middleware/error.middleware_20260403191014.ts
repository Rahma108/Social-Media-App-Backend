import type { NextFunction, Request, Response } from "express"



export const globalErrorHandler = (err:Error , req:Request , res:Response , next:NextFunction )=>{
        console.log(err)
        res.status(err.cause?.stsus).json({
            message:err.message || "Internal Server Error" ,
            stack:err.stack ,
            error : err.message
        })


}