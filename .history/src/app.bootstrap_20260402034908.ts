import express from 'express'
export const bootstrap=()=>{
    const app = express()
    app.get('/' , ()=>{  
        let message:string = "Hello ??"
    console.log({message});

    })
  
}