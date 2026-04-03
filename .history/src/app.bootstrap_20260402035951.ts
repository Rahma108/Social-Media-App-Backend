import express from 'express'
import type { Request  } from 'express'
export const bootstrap=()=>{
    const app:express.Express = express()
    app.get('/' , (req:express.Request , res:express.Response , next:express.NextFunction)=>{  
        res.send("Hello World 🤩")

    })
    app.listen(3000 , ()=>{
        console.log(`Server is running on port 3000 🚀`);
        
    })
  
}