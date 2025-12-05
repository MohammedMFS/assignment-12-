import multer from 'multer'


export const cloudFileUploadMulter = ({
    validation = []
})=>{
    const basePath = `uploads/${customPath}`
    const storage = multer.diskStorage({
    
    })

    const fileFilter = (req,res,cb)=>{
        if (["validation"].includes(file.mimType)){
            cb(null,true)
        }else{
            cb(new Error("invalid file Type"))
        }
    }

    return multer({fileFilter,storage})
}