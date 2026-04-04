
import {z} from 'zod'
import { generalValidationFields } from '../../common/validation'

export const LoginSchema = {
    body : z.strictObject({
        email:generalValidationFields.email,
        password:generalValidationFields.password,
    })
}

export const SignupSchema  = {
    body : LoginSchema.body.extend({
        username :generalValidationFields.username ,
        confirmPassword:generalValidationFields.confirmPassword
    }).superRefine((data , ctx)=>{
        if(data.password !== data.confirmPassword){
            ctx.addIssue({
                code:"custom" ,
                message: " Password Mismatch confirm password ❌",
                path:["confirmPassword"]
            })
        }
    })

}