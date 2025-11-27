export const errorHandler = (err,req,res,next)=>{
        const status = err.cause || 500
           return res.status(status).json({message:'something went wrong' , err:err.message, satck:err.satck})

     
    }
