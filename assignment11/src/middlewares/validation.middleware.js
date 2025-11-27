    import joi from 'joi'
import { Types } from 'mongoose'
    import { genderEnum } from '../DB/models/user.model.js'



    export const validation = (schema)=>{
            return (req,res,next)=>{
                const validationError =[]
                for (const key of Object.keys(schema)) {

                        const validationresults = schema[key].validate(
                        req[key],
                        {abortEarly:false} )
                        if (validationresults.error){
                              validationError.push({key , details: validationresults.error.details})
                            }
                }

                if (validationError.length) {
                    return res.status(400).json({message:"validation error",details:validationError})
                }

                return next()
              
            }
    }


    export const generalfield = {
            
         
            firstname:joi.string().min(2).max(20).messages({
                    "string.min":"first name must be at least 2 characters",
                    "string.min":"first name must be at most 20 characters",
                    "any.required":"firstname is required"
            }),
            lastname:joi.string().min(2).max(20).messages({
                    "string.min":"first name must be at least 2 characters",
                    "string.min":"first name must be at most 20 characters",
                    "any.required":"firstname is required"
            }),
            email:joi.string().email({
                    minDomainSegments:2,
                    maxDomainSegments:5,
                    tlds:{allow:['com','net','org']}
            }),
            password:joi.string(),
            confirmPassword:joi.ref("password"),
            gender:joi.string().valid(...Object.values(genderEnum)).default(genderEnum.MALE),
            phone: joi.string().pattern(new RegExp(/^01[0125][0-9]{8}$/)),
            otp:joi.string(),
            id:joi.string().custom((value,helper)=>{
            return Types.ObjectId.isValid(value) || helper.message('invalid object id format')
        })
    
    }
     
        
    
    
    
    

    