import { TokenModel } from "../DB/models/token.model.js"
import { UserModel } from "../DB/models/user.model.js"
import { verifyToken } from "../utils/token/token.utils.js"
import * as dbServices from '../DB/dbServices.js'


export const authentication = async(req,res,next)=>{

         const {authorization} = req.headers

        if (!authorization) return next(new Error("authorization token is missing",{cause:400}))

        if (!authorization.startsWith(process.env.SECRET_WORD)) return next(new Error("invalid authorization format",{cause:400}))

        // split token 
        
        const token = authorization.split(' ')[1]

        const decoded = verifyToken({
            token,
            secretKey:process.env.TOKEN_SECRET_KEY,
            
        })

        if (!decoded.jti) return  next(new Error("invalid token",{cause:401}))



        
        const revokedtoken = await dbServices.findOne({
            model:TokenModel,
            filter:{jwtid:decoded.jti}
        })
         if (revokedtoken) return next(new Error ("token is revoked",{cause:400})) 

        // find user

        const user = await dbServices.findById({
            id:decoded.id,
            model:UserModel
        })
        if (!user) return next(new Error("user not found ",{cause:404}))
        
       req.user = user
       req.decoded = decoded

      next()
    
}