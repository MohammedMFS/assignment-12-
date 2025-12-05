import joi from 'joi'
import { generalfield } from '../../middlewares/validation.middleware.js'
import { fileValidation } from '../../utils/multer/local.multer.js'

export const profileImageSchema = {
    file: joi.object({
        fieldname:generalfield.file.fieldname.valid("profileImage").required(),
        originalname:generalfield.file.originalname.required(),
        encoding:generalfield.file.encoding.required(),
        mimetype:generalfield.file.mimetype.required(),
        size:generalfield.file.size.max(1024*5*1024).required(),
         destination:generalfield.file.destination.required(),
          filename:generalfield.file.filename.required(),
           path:generalfield.file.path.required(),
           finalPath:generalfield.file.finalPath.required(),
    })
    .required()
}

export const coverImagesSchema = {
    file: joi.object({
        fieldname:generalfield.file.fieldname.valid("profileImage").required(),
        originalname:generalfield.file.originalname.required(),
        encoding:generalfield.file.encoding.required(),
        mimetype:generalfield.file.mimetype.required(),
        size:generalfield.file.size.max(1024*5*1024).required(),
         destination:generalfield.file.destination.required(),
          filename:generalfield.file.filename.required(),
           path:generalfield.file.path.required(),
    })
    .required()
}

export const freezeAccountSchema = {
    params:joi.object({
        userId:generalfield.id,

    })
}


export const restoreAccountSchema ={
      params:joi.object({
        userId:generalfield.id,

    })
}