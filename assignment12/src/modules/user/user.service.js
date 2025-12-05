import * as dbServices from '../../DB/dbServices.js'
import { TokenModel } from '../../DB/models/token.model.js'
import { roleEnum, UserModel } from '../../DB/models/user.model.js'
import { asymtricdecryption, decrypt } from '../../utils/Encryption/encryption.utils.js'
import { cloudinaryConfig } from '../../utils/multer/cloudinary.config.js'
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
  



    const {public_id,secure_url} = await cloudinaryConfig().uploader.upload(req.file.path,
        {
            folder:`sara7aApp/Users/${req.user._id}`
    }
    )

        const user = await dbServices.findOneAndUpdate({
        model:UserModel,
        filter:{_id:req.user._id},
        data:{cloudProfileImage:{public_id,secure_url}}
    })

    // destroy 
    if (req.user.cloudProfileImage?.public_id) {
        await cloudinaryConfig().uploader.destroy(
            req.user.cloudProfileImage?.public_id
        )
    }
       return successResponse({
        res,
        status:201
        ,message:'image updated successfully',data:{user}})
}


export const coverImages = async(req,res,next)=>{

    const attachments = []

    for (const files of req.files) {
        const {public_id,secure_url}= await cloudinaryConfig().uploader.upload(file.path,{
                folder:`sara7aApp/Users/${req.user._id}`
        })
        attachments.push({public_id,secure_url})
    }
  
    const user = await dbServices.findOneAndUpdate({
        model:UserModel,
        filter:{_id:req.user._id},
        data:{cloudCoverImages:attachments}
    })


       return successResponse({
        res,
        status:201
        ,message:'cover images updated successfully',data:{user}})
}


export const freezeAccount = async(req,res,next)=>{
    const {userId} = req.params
    if (userId && role.user.role !== roleEnum.ADMIN)  return next(new Error("you are not authorized to freeze Account"))

        const updateUser = await dbServices.findOneAndUpdate({
            model:UserModel,
            filter:{
                _id:userId|| req.user._id,
                freezedAt:{$exists:false}

            },
            data:{
                freezedAt: Date.now(),
                freezedBy:req.user._id
            }
        })
         return updateUser?successResponse({
            res , 
            status,
            message:"account freezed successfully",
            data:{user:updateUser}
        }) : next(new Error("invalid account"))

     

}




export const restoreAccount = async(req,res,next)=>{
    const {userId} = req.params


        const updateUser = await dbServices.findOneAndUpdate({
            model:UserModel,
            filter:{
                _id:userId,
                freezedAt:{$exists:true},
                freezedBy:{$exists:true}

            },
            data:{
                $unset:{
                    freezedAt:true,
                    freezedBy:true
                },
                restoreAt: Date.now(),
                restoreBy:req.user._id
            }
        })
         return updateUser?successResponse({
            res , 
            status,
            message:"account restored successfully",
            data:{user:updateUser}
        }) : next(new Error("invalid account"))

     

}
