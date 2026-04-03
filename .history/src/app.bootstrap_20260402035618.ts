import express from 'express'
export const bootstrap=()=>{
    const app:ثء = express()
    app.get('/' , (req , res , next)=>{  
        res.send("Hello World 🤩")

    })
    app.listen(3000 , ()=>{
        console.log(`Server is running on port 3000 🚀`);
        
    })
  
}