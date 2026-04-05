import { config } from 'dotenv'
import { resolve } from 'path'

config({
   path: resolve(`./.env.${process.env['NODE_ENV'] || 'development'}`)
})


export const PORT = process.env['PORT']  as string
export const DB_URI = process.env['DB_URI'] as string
export const REDIS_URI= process.env['REDIS_URI'] as string
