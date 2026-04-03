


export const globalErrorHandler = (err:Error , req:any , res:any , next:any )=>{
        console.log(err)
        res.status(500).json({
            message:"Internal Server Error" ,
            error : err.message
        })


}