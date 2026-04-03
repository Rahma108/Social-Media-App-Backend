import express from 'express'
import type { Request , Response , NextFunction } from 'express'
import { authRouter } from './modules'
export const bootstrap=()=>{
    const app:express.Express = express()
    app.get('/' , (req:Request , res:Response , next:NextFunction)=>{  
        res.send("Hello World 🤩")

    })
    // app routing ...
    app.use("/auth" , authRouter)
    app.use('')
    app.listen(3000 , ()=>{
        console.log(`Server is running on port 3000 🚀`);
        
    })
  
}