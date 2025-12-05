import express from 'express'
import authRouter from './src/modules/auth/auth.controller.js'
import userRouter from './src/modules/user/user.controller.js'
import messageRouter from './src/modules/message/message.controller.js'
import { ConnectDB } from './src/DB/connection.js';
import { errorHandler } from './src/utils/errorHandler.utils.js';
import path from 'node:path'
import { attachRouterWithLogger } from './src/utils/logger/logger.util.js';
import { corsOption } from './src/utils/cors/cors.util.js';
import  {rateLimit} from "express-rate-limit"
const bootstrab =async  (app,express)=>{
    
    await ConnectDB()
    
    app.use(cors(corsOption()))
    app.use(helmet())

    const limiter = rateLimit({
        windowMs:5*60*1000,
        limit:5,
        message:{
            statusCode:429,
            messgae:"too many request , please try again"
        },
        leagcyHeaders:true
    })
    
    app.use(limiter)
   app.use(express.json());
    app.get('/',(req,res)=>{
        res.status(200).json({message:'hello from sara7a'})
    })

    attachRouterWithLogger(app , "/api/v1/auth" , authRouter , "auth.log")

    app.use('uploads',express.static(path.resolve('./src/uploads')))

    app.use('/api/v1/auth',authRouter)
    app.use('/api/v1/user',userRouter)
    app.use('/api/v1/message',messageRouter)

   app.use(errorHandler)

    app.all('/*dummy',(req,res)=>{
        res.status(404).json({message:'not found'})
    })
}
export default bootstrab