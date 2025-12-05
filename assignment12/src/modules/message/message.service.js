import path from 'node:path'
import * as dbServices from '../../DB/dbServices.js'
import { messageModel } from '../../DB/models/message.model.js'
import { UserModel } from '../../DB/models/user.model.js'
import { successResponse } from '../../utils/successResponse.utils.js'
export const sendMessage = async (req,res,next) => {
    const {content} = req.body
    const {receiverId} = req.params

    // check if user exist
    const user = await dbServices.findById({
        model:UserModel,
        id:receiverId
    })
    if (!user) return next(new Error('user not found',{cause:404}))

        const message = await dbServices.create({
            model:messageModel,
            data:[{
                content,
                receiverId:user._id
            }]
        })

        return successResponse({
            res,
            status:201,
            message:'message added successfully',
            data:{message}
        })
}


export const getMessages = async (req,res,next) => {
   

        const messages = await dbServices.find({
            model:messageModel,
            populate:[{path:"receiverId",select:"firstname lastname -_id "}]
        })
        if (!messages) return next(new Error('no messages found',{cause:409}))

        return successResponse({
            res,
            status:201,
            data:{messages}
        })
}