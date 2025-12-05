import joi from 'joi'
import { genderEnum, roleEnum } from '../../DB/models/user.model.js'
import { generalfield } from '../../middlewares/validation.middleware.js'
export const signUpSchema = {
    body:
        joi.object({
        firstname:generalfield.firstname.required(),
        lastname:generalfield.lastname.required(),
        email:generalfield.email.required(),
        password:generalfield.password.required(),
        confirmPassword:generalfield.confirmPassword,
        gender:generalfield.gender,
        phone: generalfield.phone,
        role:joi.string().valid("USER","ADMIN").default(roleEnum.USER)
})
    
}



const loginSchema = joi.object({

        email:generalfield.email.required(),
        password:generalfield.password.required(),

})


const confirmEmailSchema = joi.object({

        email:generalfield.email.required(),
        
        otp:joi.string().required(),

})

export const forgetPasswordSchema = joi.object({

       body: joi.object({
        email:generalfield.email.required()
       })
        
        
})


export const resetPasswordSchema = joi.object({

       body: joi.object({
        email:generalfield.email.required(),
        password:generalfield.password.required(),
        otp:generalfield.otp,
        confirmPassword:generalfield.confirmPassword
       })
        
        
})