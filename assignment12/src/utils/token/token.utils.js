import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
import {v4 as uuid} from "uuid"
import { roleEnum } from '../../DB/models/user.model.js'
export const SignitureEnum = {
  USER:"USER",
  ADMIN:"ADMIN"
}


export const generateToken = ({
  payload,
  secretKey = process.env.TOKEN_SECRET_KEY,
  options = { }
}) => {
  return jwt.sign(payload, secretKey, options)
}


export const verifyToken = ({ token,secretKey }) => {
  return jwt.verify(token, secretKey)
}



export const getSigniture = async ({SignitureLevel=SignitureEnum.USER}) => {

  let signitures = {
    accessSigniture:undefined,
    refreshSigniture:undefined
  }

  switch(SignitureLevel){
    case SignitureEnum.ADMIN:
      signitures.accessSigniture= process.env.TOKEN_ACCESS_ADMIN_SECRET
      signitures.refreshSigniture= process.env.TOKEN_REFRESH_ADMIN_SECRET
      break;

      default:
      signitures.accessSigniture= process.env.TOKEN_ACCESS_USER_SECRET
      signitures.refreshSigniture= process.env.TOKEN_REFRESH_USER_SECRET

      break;

  }
  return signitures
}



export const getLoginCreidentials = async (user) => {
   const signitures = await getSigniture({
    SignitureLevel:
    user.role != roleEnum.USER ? SignitureEnum.ADMIN : SignitureLevel.USER
   })
   const jwtid = uuid()
    const accessToken =  generateToken({
                                   payload:{id:user._id,email:user.email},
                                   secretKey:process.env.TOKEN_ACCESS_ADMIN_SECRET,
                                   
                                   options:{
                                           expiresIn:parseInt(process.env.ACCESS_TOKEN_EXPIRES_IN),
                                           issuer:"http://localhost:3000",
                                           audience:"http://localhost:5000",
                                           jwtid
                                   }
                           })
  
        const refreshToken =  generateToken({
                        payload:{id:user._id,email:user.email},
                          secretKey:process.env.TOKEN_REFRESH_ADMIN_SECRET,                           
                       options:{
                           expiresIn:parseInt(process.env.REFRESH_TOKEN_EXPIRES_IN),
                              issuer:"http://localhost:3000",
                          audience:"http://localhost:5000",
                          jwtid:uuid()
          
                                          }
                                  })

                                  return{accessToken,refreshToken}
   
}