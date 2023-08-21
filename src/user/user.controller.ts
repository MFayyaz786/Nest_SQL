import { Controller, Get, Param, Body, Post,Req, Delete, Query, Res, HttpStatus, NotFoundException } from '@nestjs/common';
import { User } from './user.schema';
import { UserServices } from './user.services';

@Controller('auth')
export class UserController{
    constructor(private authService:UserServices){}
@Post()
async signUp(@Res() res,@Body() authData:User):Promise<User>{
    const result=await this.authService.signUp(authData);
    return res.status(HttpStatus.OK).send({msg:"Registered successfully"})
}
@Post('login')
async singIn(@Res() res,@Req() req,@Body() signInData):Promise<User>{
    const user=await this.authService.signIn(signInData.email);
    if(user){
     const validatePassword = await this.authService.validatePassword(signInData.password, user.password);
      if (validatePassword) {
        delete user.password;
      return  res.status(200).send({
          msg: "Login Successfully",
          data: user,
        });
      } else {
        res.status(401).send({
          msg: "Invalid Credentials!",
        });
      }
    } else {
     return res.status(401).send({
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
}
