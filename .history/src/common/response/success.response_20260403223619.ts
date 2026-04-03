
import type { Request  , Response , NextFunction } from "express" 
export const successResponse = <T = any >(
    {res , message= "Success" , data = null , status = 200 } :
    {res , message?: string , data?:any , status?:number } )=>{

}