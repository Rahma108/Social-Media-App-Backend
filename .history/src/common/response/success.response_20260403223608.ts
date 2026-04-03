
import type { Request  , Response , NextFunction } from "express" 
export const successResponse = <>(
    {res , message= "Success" , data = null , status = 200 } :
    {res , message?: string , data?:any , status?:number } )=>{

}