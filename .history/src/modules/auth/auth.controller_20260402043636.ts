import { Router } from "express"; 

const router = Router()


router.post('/login' , (req:Request , res:Res )=>{
    res.send("Login Successful  ")

})


export default router
