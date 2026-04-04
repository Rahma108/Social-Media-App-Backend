
import {z} from 'zod'

export const LoginSchema = {
    body : z.strictObject({
        email:z.email({ message: "Invalid Email❌" }),
        password: z
        .string({ message: "Invalid Password❌" })
        .regex(/^(?=.*[A-Za-z])(?=.*\d).{8,}$/, {
            message:
            "Password must contain at least one letter and one number and be at least 8 characters",
        }),
    })
}

export const SignupSchema  = {
    body : LoginSchema.body.extend({
        username : z.string({message:"UserName is Required❌"}).min(2).max(25) ,
        confirmPassword: z.string({ message: "Invalid  Confirm Password ❌" })
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