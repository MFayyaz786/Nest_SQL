import { Controller, Get, Param, Body, Post,Req, Delete, Query, Res, HttpStatus, NotFoundException,NestMiddleware } from '@nestjs/common';
import { User } from './user.schema';
import { UserServices } from './user.services';
import jwtServices from 'src/utils/jwtServices';
import {AuthServices} from "./auth.services"
import { v4 as uuidv4 } from 'uuid';
import { JwtPayload } from 'jsonwebtoken';

@Controller('auth')
export class UserController{
    constructor(private authService:UserServices,private authServices:AuthServices){}
@Post()
async signUp(@Res() res,@Body() authData:User):Promise<User>{
    const result=await this.authService.signUp(authData);
    return res.status(HttpStatus.OK).json({msg:"Registered successfully"})
}
@Post('login')
async singIn(@Res() res,@Req() req,@Body() signInData):Promise<User>{
    const user=await this.authService.signIn(signInData.email);
    if(user){
     const validatePassword = await this.authService.validatePassword(signInData.password, user.password);
      if (validatePassword) {
      const uuid = uuidv4();
      const refreshToken =await jwtServices.create({uuid, type: "user"} );
      const accessToken =await jwtServices.create(
        { userId: user.id,type: "user" },
        "5m"
      );      
      this.authServices.add(user.id,String(uuid)); 
      delete user.password;
      return  res.status(HttpStatus.OK).json({
          msg: "Login Successfully",
          data: user,
          accessToken:accessToken,
          refreshToken:refreshToken
        });
      } else {
        res.status(HttpStatus.UNAUTHORIZED).json({
          msg: "Invalid Credentials!",
        });
      }
    } else {
     return res.status(HttpStatus.UNAUTHORIZED).json({
        msg: "Invalid Credentials!",
      });
    }
}

@Post('requestOtp')
async requestOtp(@Req() req,@Res() res,@Body() credential:{email:String}):Promise<User>{
  const result=await this.authService.requestOtp(credential.email);
  if(result[0]<=0){
  return res.status(HttpStatus.BAD_REQUEST).json({msg:"Otp Not Sent!"})
  }
  return res.status(HttpStatus.OK).json({msg:"Otp Sent"})
}
@Post('verifyOtp')
async verifyOtp(@Req() req,@Res() res, @Body() credentials:{email:String,otp:Number}):Promise<User>{
    const isExpire=await this.authService.isExpired(credentials.email);
    if(!isExpire.dataValues){
        return  res.status(HttpStatus.BAD_REQUEST).json({msg:"OTP Expired!"})
    }
    const result=await this.authService.verifyOtp(credentials);
    if(result!==null){
        return res.status(HttpStatus.OK).json({msg:"OTP Verified"})
    }else{
        return res.status(HttpStatus.BAD_REQUEST).json({msg:"OTP Incorrect!"})
    }
}
@Delete("/:id")
async deleteUser(@Req() req,@Res() res,@Param() credentials:{id:String}):Promise<any>{
  const result=await this.authService.delete(credentials.id);
  console.log("result: ", result);
  if(result){
    return res.status(HttpStatus.OK).json({msg:"Deleted"})
  }else{
    return res.status(HttpStatus.NOT_FOUND).json({msg:"Not Found!"})
  }
}
@Post("refreshToken")
async refreshToken(@Res() res,@Req() req,@Body() body:{refreshToken:String}):Promise<any>{
    const verifyToken =await jwtServices.authenticate(String(body.refreshToken)) as JwtPayload;
    console.log("verifyToken: ", verifyToken);
    if (verifyToken) {
      const { uuid, type, } = verifyToken;
      const AuthId = await this.authServices.findByUUID(String(uuid));
      console.log("AuthId: ", AuthId);
      if (AuthId) {
        const { userId } = AuthId; 
        if (userId) {
          const accessToken =await jwtServices.create({ userId, type }, "5m");
         return res.status(HttpStatus.OK).json({ msg: "access Token", data: { accessToken } });
        } else {
         return res.status(HttpStatus.UNAUTHORIZED).json({ msg: "Login please" });
        }
      } else {
       return res.status(HttpStatus.UNAUTHORIZED).json({ msg: "Login please" });
      }
    } else {
     return res.status(HttpStatus.UNAUTHORIZED).json({ msg: "Login please" });
    }
  }
}
