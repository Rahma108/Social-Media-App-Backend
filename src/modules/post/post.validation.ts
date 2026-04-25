
import {z} from 'zod'
import { AvailabilityEnum } from '../../common/enums'
import { Types } from 'mongoose'
export const createPost ={

    body: z.strictObject({
        content: z.string().optional() ,
        files: z.array(z.any()).optional() ,

        tags : z.array(z.string()).optional() ,
        availability: z.coerce.number().default(AvailabilityEnum.PUBLIC)


    }).superRefine((args , ctx)=>{

        if(!args.content && ! args.files?.length ){

            ctx.addIssue({
                code : "custom" ,
                path : ['content'] ,
                message : "Content is Required"



            })

        }

        if(args.tags){
            const uniqueTags= [...new Set(args.tags)]
            if(uniqueTags.length != args.tags.length ){
                ctx.addIssue({
                    code : "custom" ,
                    path : ['tags'] ,
                    message : "Duplicated Mention accounts "
                })

            }

            for (const tag of args.tags ) {
                if(!Types.ObjectId.isValid(tag)){
                    ctx.addIssue({
                    code : "custom" ,
                    path : ['tags'] ,
                    message : `Invalid Mention Object Id ❌ ${tag} `
                })




                }
                
            }

        }

    })



}