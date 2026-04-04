
import { LoginSchema, SignupSchema } from "./auth.validation"
import {z} from "zod"
export type LoginDTO = z.infer<typeof LoginSchema.body>
export type SignupDTO = z.infer<typeof SignupSchema.body>