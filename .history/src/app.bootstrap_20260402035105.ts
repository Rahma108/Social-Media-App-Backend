import express from 'express'
import { log } from 'node:console'
export const bootstrap=()=>{
    const app = express()
    app.get('/' , (req , res , next)=>{  
        res.send("Hello World 🤩")

    })
    app.listen(3000 , ()=>{
        console.log(`Server is running on post`);
        
    })
  
}