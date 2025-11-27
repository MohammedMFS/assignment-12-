import express from 'express'
import authRouter from './src/modules/auth/auth.controller.js'
import userRouter from './src/modules/user/user.controller.js'
import messageRouter from './src/modules/message/message.controller.js'
import { ConnectDB } from './src/DB/connection.js';
import { errorHandler } from './src/utils/errorHandler.utils.js';
const bootstrab =async  (app,express)=>{
    
    await ConnectDB()

   app.use(express.json());
    app.get('/',(req,res)=>{
        res.status(200).json({message:'hello from sara7a'})
    })
    app.use('/api/v1/auth',authRouter)
    app.use('/api/v1/user',userRouter)
    app.use('/api/v1/message',messageRouter)

   app.use(errorHandler)

    app.all('/*dummy',(req,res)=>{
        res.status(404).json({message:'not found'})
    })
}
export default bootstrab