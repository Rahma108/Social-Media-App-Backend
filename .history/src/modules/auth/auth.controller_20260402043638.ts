import { Router } from "express"; 

const router = Router()


router.post('/login' , (req:Request , res:Respo )=>{
    res.send("Login Successful  ")

})


export default router
