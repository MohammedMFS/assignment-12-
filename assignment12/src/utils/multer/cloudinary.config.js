import {v2 as cloudinary} from 'cloudinary'

export const cloudinaryConfig = ()=>{
     cloudinary.config({
        cloud_name:process.env.CLOUD_NAME,
        Api_key:process.env.API_KEY,
         Api_secret:process.env.API_SECRET,
    })
    return cloudinary
}

