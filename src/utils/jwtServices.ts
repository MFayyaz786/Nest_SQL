import * as jwt from "jsonwebtoken";
import * as dotenv from "dotenv";
dotenv.config()
const jwtServices={
create:async(data:object,expiresIn?:string)=>{
       try {
       const jwtKey=process.env.JWT_SECRET
       if(!jwtKey){throw new Error("JWT secret key not found in environment variables")}
       const defaultExpiresIn = process.env.NODE_ENV === 'development' ? '5m' : '365d';
       return  jwt.sign(data, jwtKey, { expiresIn: expiresIn || defaultExpiresIn });;
        } catch (error) {
        console.log("error",error)
       }
},
authenticate:async(token:string)=>{
try{    
    if(!process.env.JWT_SECRET){throw new Error("JWT secret key not found in environment variables")}
    return jwt.verify(token,process.env.JWT_SECRET)
}catch(error){
    console.log("error",error)
}
}
}
export default jwtServices