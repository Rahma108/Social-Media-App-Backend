import express from 'express'
import type { Request , Response , NextFunction } from 'express'
import { authRouter } from './modules'
import cors from 'cors'
import { globalErrorHandler } from './middleware'
export const bootstrap=()=>{
    const app:express.Express = express()
    // Global Middleware 
    app.use(cors() , express.json())

    // Base Routing 
    app.get('/' , (req:Request , res:Response , next:NextFunction)=>{  
        res.send("Hello World 🤩")

    })
    // app routing ...
    app.use("/auth" , authRouter)

    // Invalid Routing 
    app.use('/*dummy' ,  (req:Request , res:Response , next:NextFunction)=>{  
        res.status(40).json({Message  : "Not Found "})

    })
    // Global Error Handling 
    app.use(globalErrorHandler);
    
    app.listen(3000 , ()=>{
        console.log(`Server is running on port 3000 🚀`);
        
    })
    console.log(`App Bootstrap Successfully 🤩`);

}