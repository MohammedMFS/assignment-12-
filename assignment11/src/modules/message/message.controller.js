import { Router } from "express";
import * as  messageServices from './message.service.js'
import { validation } from "../../middlewares/validation.middleware.js";
import { sendMessageSchema } from "./message.validate.js";
const router = Router()

router.get('/',(req,res)=>{
    res.status(200).json({message:'hello from message'})
})

router.post('/send-message/:receiverId',validation(sendMessageSchema),messageServices.sendMessage)

router.get('/get-messages',messageServices.getMessages)

export default router