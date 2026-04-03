import express from 'express'
import type { Request , Response , NextFunction } from 'express'
import { authRouter } from './modules'
import cors from 'cors'
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
    
    app.use('/*dummy' ,  (req:Request , res:Response , next:NextFunction)=>{  
        res.status(40).json({Message  : "Not Found "})

    })
    app.listen(3000 , ()=>{
        console.log(`Server is running on port 3000 🚀`);
        
    })
  
}