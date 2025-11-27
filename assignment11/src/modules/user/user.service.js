import * as dbServices from '../../DB/dbServices.js'
import { TokenModel } from '../../DB/models/token.model.js'
import { UserModel } from '../../DB/models/user.model.js'
import { asymtricdecryption, decrypt } from '../../utils/Encryption/encryption.utils.js'
import { successResponse } from '../../utils/successResponse.utils.js'
import { verifyToken } from '../../utils/token/token.utils.js'

export const listAllusers = async(req,res,next)=>{
   let users =   await dbServices.find({
        model:UserModel,
        populate:[{path:"messages",select:"-id"}]
    })
    // users = users.map((user)=>{
    //     return {...user._doc, phone:asymtricdecryption(user.phone)}
    // })

       return successResponse({res,status:201,message:'user created successfully',data:{users}})
}


export const updateProfile = async(req,res,next)=>{
  

    const {firstname,lastname,gender} = req.body

    const user = await dbServices.findByIdAndUpdate({
        model:UserModel,
        id:req.decoded.id,
        data:{firstname,lastname,gender},
        
    })


       return successResponse({
        res,
        status:201
        ,message:'user created successfully',data:{user}})
}


export const profileImage = async(req,res,next)=>{
  



       return successResponse({
        res,
        status:201
        ,message:'image updated successfully',data:{file: req.file}})
}


