import { Router } from "express";
import * as  userServices from './user.service.js'
import { authentication, authorization, tokenTypeEnum } from "../../middlewares/auth.middleware.js";
import { fileValidation, localFileUpload } from "../../utils/multer/local.multer.js";
import { validation } from "../../middlewares/validation.middleware.js";
import { coverImagesSchema, freezeAccountSchema, profileImageSchema, restoreAccountSchema } from "./user.validation.js";
import { cloudFileUploadMulter } from "../../utils/multer/cloud.multer.js";
import { roleEnum } from "../../DB/models/user.model.js";
const router = Router()

router.get('/',userServices.listAllusers)

router.patch('/update-profile',authentication({tokenType:tokenTypeEnum.ACCESS}),authorization({accessRoles:[roleEnum.USER]}),userServices.updateProfile)

router.patch('/profile-image',
    authentication,
    authorization({accesRoles:["USER"]}),
    // localFileUpload({customPath:"User",
    //     validation:[...fileValidation.images]}).single("profileImage"),
    cloudFileUploadMulter({validation:[...fileValidation.images]}).single("profileImage"),
        userServices.profileImage)


router.patch('/cover-image',
    // localFileUpload({customPath:"User",validation:[...fileValidation.images]})
    // .single("coverImages",4),
    // validation(coverImagesSchema),
     cloudFileUploadMulter({validation:[...fileValidation.images]}).array("coverImages",5),
    userServices.coverImages
    
)

router.delete('{/:userId}/freeze-account',
    authentication({tokenType:tokenTypeEnum.ACCESS},
        authorization({accesRoles:[roleEnum.USER,roleEnum.ADMIN]}),
        validation(freezeAccountSchema),
        userServices.freezeAccount
    )
)

router.patch('/:userId/freeze-account',
    authentication({tokenType:tokenTypeEnum.ACCESS},
        authorization({accesRoles:[roleEnum.USER,roleEnum.ADMIN]}),
        validation(restoreAccountSchema),
        userServices.restoreAccount
    )
)

export default router