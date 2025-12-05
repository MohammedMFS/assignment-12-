import { TokenModel } from "../DB/models/token.model.js"
import { UserModel } from "../DB/models/user.model.js"
import { getSigniture, verifyToken } from "../utils/token/token.utils.js"
import * as dbServices from '../DB/dbServices.js'

export const tokenTypeEnum = {
    ACCESS:"ACCESS",
    REFRESH:"REFRESH"
}

export const decodedToken = async ({authorization,tokenType=tokenTypeEnum.ACCESS,next}={}) => {
    const [Bearer,token] = authorization.split(" ")||[]

    if (!Bearer||!token) return next(new Error("ibvalid token",{cause:400}))

      let signitures = await getSigniture({SignitureLevel:Bearer})

      const decoded = verifyToken({
        token,
        secretKey: tokenType === tokenTypeEnum.ACCESS?signitures.accessSigniture:signitures.refreshSigniture
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
        if (!user) return next(new Error("notRegistred Accont ",{cause:404}))

            return {user,decoded}

}
export const authentication = ({tokenType=tokenTypeEnum.ACCESS}={})=>{
   
    return async (req,res,next)=>{
         const {user,decoded} = await decodedToken({
            authorization:req.headers.authorization,
            tokenType,
            next
         })||{}
          req.user = user 
        req.decoded = decoded 
        return next()
    }
    
}

export const authorization = async({accessRoles=[]}={})=>{
    return (req,res,next)=>{

        if (!accessRoles.includes(req.user.role)) {
            return next (new Error("unAuthorized Access ",{cause:304}))
        }
        return next()
    }
    
}