import joi from 'joi'
import { Types } from 'mongoose'
import { generalfield } from '../../middlewares/validation.middleware.js'

export const sendMessageSchema = {
    body: joi.object({
        content:joi.string().min(2).max(500).required()
    }),
    params: joi.object({
         receiverId: generalfield.id.required()
    })
}