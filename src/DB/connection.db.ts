import { connect } from "mongoose"
import { DB_URI } from "../config/config"


export const connectDB = async()=>{
    try {
        await connect( DB_URI , {serverSelectionTimeoutMS : 30000})
        console.log(`DB Connected Successfully 😎`)
    } catch (error) {
        console.log(`Fail To Connect On DB ${error} 🫠`)
    }



}