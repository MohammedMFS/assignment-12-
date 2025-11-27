import { Router } from "express";
import * as  authServices from './auth.service.js'
import { authentication } from "../../middlewares/auth.middleware.js";
import { validation } from "../../middlewares/validation.middleware.js";
import {forgetPasswordSchema, resetPasswordSchema, signUpSchema} from './auth.validate.js'
const router = Router()

router.get('/',(req,res)=>{
    res.status(200).json({message:'hello from auth'})
})
router.post('/signup',validation(signUpSchema),authServices.signUp)

router.post('/login',authServices.login)

router.patch('/confirm-email', authServices.confirmEmail)

router.post('/logout',authentication,authServices.logout)

router.patch('/forget-password', validation(forgetPasswordSchema),authServices.forgetPassword)

router.patch('/reset-password', validation(resetPasswordSchema),authServices.resetPssword)


export default router