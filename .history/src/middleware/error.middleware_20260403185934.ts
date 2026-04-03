import { Request } from "express"



export const globalErrorHandler = (err:Error , req:Request , res:Re , next:any )=>{
        console.log(err)
        res.status(500).json({
            message:"Internal Server Error" ,
            error : err.message
        })


}