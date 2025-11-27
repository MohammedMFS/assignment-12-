import { Router } from "express";
import * as  userServices from './user.service.js'
import { authentication } from "../../middlewares/auth.middleware.js";
import { localFileUpload } from "../../utils/multer/local.multer.js";
const router = Router()

router.get('/',userServices.listAllusers)

router.patch('/update-profile',authentication,userServices.updateProfile)

router.patch('/profile-image',localFileUpload().single("profileImage"),userServices.profileImage)

export default router