import { redisService } from './common/service/redis.service';
import express from 'express'
import type { Request , Response , NextFunction } from 'express'
import { authRouter, userRouter } from './modules'
import cors from 'cors'
import { globalErrorHandler } from './middleware'
import { connectDB } from './DB/connection.db'
import { PORT } from './config/config'
export const bootstrap=async ()=>{
    const app:express.Express = express()
    // Global Middleware 
    app.use(cors() , express.json())
    // Base Routing 
    app.get('/' , (req:Request , res:Response , next:NextFunction)=>{  
        res.send("Hello World 🤩")

    })
    // app routing ...
    app.use("/auth" , authRouter)
    app.use('/user', userRouter)

    // Invalid Routing 
    app.use('/*dummy' ,  (req:Request , res:Response , next:NextFunction)=>{  
        res.status(40).json({Message  : "Not Found "})

    })
    // Global Error Handling 
    app.use(globalErrorHandler);
    
    await connectDB()
    await redisService.connectRedis()
    await redisService.set({key : "name" , value:"rahma" , ttl:200})
    app.listen(PORT, ()=>{
        console.log(`Server is running on port 3000 🚀`);
        
    })
    console.log(`App Bootstrap Successfully 🤩`);

}