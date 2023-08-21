import { Sequelize  } from 'sequelize-typescript';
import { Injectable, Query } from '@nestjs/common';
import {Model,QueryTypes,Op} from "sequelize"
import { User } from './user.schema';
import * as bcrypt from "bcrypt";
import {SequelizeModule,InjectModel} from "@nestjs/sequelize"
@Injectable()
export class UserServices{
    constructor(@InjectModel(User) private userModel:typeof User){}
    async signUp(userData:Partial<User>):Promise<User>{
        const salt=await bcrypt.genSalt(10);
        userData.password=await bcrypt.hash(userData.password,salt);
        console.log("userData",userData)
    const result= await this.userModel.create(userData);
    return  result
    }

    async signIn(email:String):Promise<User>{
    return await this.userModel.findOne({where:{email:email}});
    }

    async validatePassword(password:string, realPassword:string):Promise<User>{
    console.log(password, realPassword);
    const valid = await bcrypt.compare(password, realPassword);
    console.log("valid: ", valid);
    return valid;
  }

  async requestOtp(email:String):Promise<any>{
    const expireTime = new Date();
  expireTime.setMinutes(expireTime.getMinutes() + 5);
  console.log("expireTime: ", expireTime);

    return await this.userModel.update({otp:1122,otpExpire:expireTime},{where:{email:email}})
  }
  async isExpired(email:String):Promise<any>{
    const now=new Date();
    console.log("now: ", now);
    const result=await this.userModel.findOne({where:{email:email,otpExpire: {
        [Op.gt]: now,
      },}})
    return result;
  }
  async verifyOtp(credentials:any):Promise<any>{
    return await this.userModel.findOne({where:{email:credentials.email,otp:credentials.otp}});
  }
  async delete(id:String):Promise<any>{
    return this.userModel.destroy({where:{id:id}});
  }
}