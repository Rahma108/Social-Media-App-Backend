import { Request, Response } from "express"



export const globalErrorHandler = (err:Error , req:Request , res:Response , next: )=>{
        console.log(err)
        res.status(500).json({
            message:"Internal Server Error" ,
            error : err.message
        })


}