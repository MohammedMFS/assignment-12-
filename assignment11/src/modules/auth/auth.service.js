import { genderEnum, UserModel } from "../../DB/models/user.model.js"
import { successResponse } from "../../utils/successResponse.utils.js"
import * as dbService from '../../DB/dbServices.js'
import { asymtricEncryption, encrypt } from "../../utils/Encryption/encryption.utils.js"
import { hash } from "../../utils/Encryption/hash.utils.js"
import { compare } from "../../utils/Encryption/hash.utils.js"
import { eventEmitter } from "../../utils/event/email.event.utils.js"
import { customAlphabet } from "nanoid"
import { generateToken, verifyToken } from "../../utils/token/token.utils.js"
import {v4 as uuid} from 'uuid'
import { TokenModel } from "../../DB/models/token.model.js"
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'
import joi from 'joi'



export const signUp = async(req,res,next)=>{

        const{firstname,lastname,email,password,gender,phone} = req.body


       return  res.json({validationresults})

        const userExistsing = await dbService.findOne({
                model:UserModel,
                filter:{email}
        })
        if (userExistsing) return  next(new Error('user already exists', {cause:409}))

         // encrypt phone 
         const encryptedPhone = await encrypt(phone)

        //  hash password 
        const hashedPassword = await hash({plainText:password})

        // generate otp 
        const otp = customAlphabet("123456789qwertyuioplkjhgfd")()
        
        // confirm email 
         eventEmitter.emit("confirmEmail",{to:email})


        const user = await dbService.create({
                model:UserModel,
                data:[{firstname,lastname,email,password:hashedPassword,gender,
                        phone:encryptedPhone,
                        confirmEmailOTP:await hash({ plainText: otp })
                }] ,options:true,
        })

        return  successResponse({res,status:201,message:"user created succedssfully",data:{user}})

  


}


export const login = async(req,res,next)=>{



                const {email,password} = req.body 

                const user= await dbService.findOne({
                        model:UserModel,
                        filter:{email}
                })

                if (!user) return next(new Error('user not exists',{cause:409}))

                        // compare password 

                        const unHashedPass = await compare({plainText:password,hash:user.password})
                        if (!unHashedPass) return next(new Error('wrong password',{cause:409}))

                        const accessToken =  generateToken({
                                payload:{id:user._id,email:user.email},
                                options:{
                                        issuer:"http://localhost:3000",
                                        audience:"http://localhost:5000"
                                }
                        })

                        return successResponse({res,status:202,message:'login successfully',data:{accessToken}})
  
}

export const confirmEmail = async(req,res)=>{
        const {email,otp}= req.body 
           const checkUser = await dbService.findOne({
                model:UserModel,
                filter:{email , confirmEmail:{$exists:false} , confirmEmailOTP:{$exists:true}}
        })

           // check 
        if (!checkUser) {
              return next(new Error('user already exists or email already confirmed', {cause:404}))
        }

            // check by hash 
        if (!(await compare({plainText:otp , hash:checkUser.confirmEmailOTP}))) 
                return next(new Error ('invalid  otp',{cause:400}))


        // update user

        await dbService.updateOne(
                {
                        model:UserModel,
                        filter:{email},
                        data:{
                                confirmEmail:Date.now(),
                                $unset:{ confirmEmailOTP:true },
                                $inc:{__v:1}
                        }
                }
        )

        return successResponse({
                res,
                status:200,
                message:"email confirmed successfully"
        })




}



export const logout = async(req,res)=>{

        const {jti} = req.decoded

        await dbService.create({
                model:TokenModel,
                data:[{
                        jwtid:jti,
                        expiresIn:new Date(decodedData.exp * 1000)
                }]

        })



        return successResponse({
                res,
                status:200,
                message:"log out successfully"
        })




}




export const forgetPassword = async(req,res)=>{

        const {email} =  req.body

        // create otp 
        const otp = await customAlphabet("12345678910qwertyuio",6)()
        // hash otp 
        const hashedotp = await hash({plainText:otp})

        const user = await dbService.findOneAndUpdate({
                model:UserModel,
                filter:{
                        email,
                        confirmEmail:{$exists:true}
                },
                data:{
                      forgetPasswordOTP:hashedotp  
                }
        })
           if (!user) 
              return next(new Error('user not found or email not confirmed', {cause:404}))
        
        //    send mail 

        eventEmitter.emit("forgetPassword",{
                to:email,
                firstname:user.firstname,
                otp
        })




        return successResponse({
                res,
                status:200,
                message:"check ur box "
        })




}





export const resetPssword = async(req,res)=>{

        const{email,otp,password} = req.body 

        const user = await dbService.findOne({
                model:UserModel,
                filter:{
                        email,
                        confirmEmail:{$exists:true}
                }
        })

         if (!user) return next(new Error('user not found or email not confirmed', {cause:404}))

         if (!(await compare({plainText:otp , hash:user.forgetPasswordOTP}))) 
                return next(new Error('uinvalid otp', {cause:409}))

         await dbService.findOneAndUpdate({
                model:UserModel,
                filter:email,
                data:{
                        password:await hash({plainText:password}),
                        $unset:{forgetPasswordOTP:true},
                        $inc:{__v:1}
                }
         })




        return successResponse({
                res,
                status:200,
                message:"password reseted successfully "
        })



}