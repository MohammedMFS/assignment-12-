import { v4 as uuidv4 } from 'uuid'
import jwt from 'jsonwebtoken'
export const generateToken = ({
  payload,
  secretKey = process.env.TOKEN_SECRET_KEY,
  options = { expiresIn: process.env.EXPIRES_TOKEN_TIME }
}) => {
  return jwt.sign(payload, secretKey, options)
}


export const verifyToken = ({ token,secretKey }) => {
  return jwt.verify(token, secretKey)
}







