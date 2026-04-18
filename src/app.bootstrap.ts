import { redisService } from './common/service/redis.service';
import express from 'express'
import type { Request , Response , NextFunction } from 'express'
import { authRouter, userRouter } from './modules'
import cors from 'cors'
import { globalErrorHandler } from './middleware'
import { connectDB } from './DB/connection.db'
import { PORT } from './config/config'
import { UserRepository } from './DB/repository';
import { GenderEnum } from './common/enums';
import { Types } from 'mongoose';
// import { GenderEnum, ProviderEnum } from './common/enums';

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

    try {
        // const user = new UserModel({
        // username : "Rahma Salama" ,
        // password : "7tfghvcjc",
        // email : `${Date.now()}@gmail.com` ,
        // phone :"01045333733" ,
        // provider: ProviderEnum.SYSTEM , 
        // extra:{
        //     name : "lolo lolo "
        // } }  
        // )
        // user.save({validateBeforeSave : true }) 
        // const userRepository = new UserRepository()
        // const user = await userRepository.insertMany(
        //     {data:
        //     [ {
        //         username : "errr errrr" , 
        //         email : `${Date.now()}@gmail.com`  ,
        //         phone :"01045333733" ,
        //         password : "7tfghvcjc" }
        //     ]}) 

        const userRepository = new UserRepository()
        // const user = await userRepository.find({filter:
        //     {gender: GenderEnum.MALE  ,
        //         paranoid : false  ,
        //         deletedAt:{$exists:true }
        //     }})
        // const user = await userRepository.updateOne({
        //     filter:{
        //         _id:Types.ObjectId.createFromHexString('69df02a9eafd63d72821f2dc') ,
        //         paranoid : false
        //     },
        //     update:{
        //         gender:GenderEnum.MALE ,
        //         restoredAt:new Date()
        //     }
        
        //     })





        const user = await userRepository.deleteOne({
            filter:{
                _id:Types.ObjectId.createFromHexString('69df02a9eafd63d72821f2dc') ,
                // paranoid : false
                force : true 
            }
        
            })
        console.log(user)

    } catch (error) {
        console.log(error)
    }
    app.listen(PORT, ()=>{
        console.log(`Server is running on port 3000 🚀`);
        
    })

    console.log(`App Bootstrap Successfully 🤩`);

}