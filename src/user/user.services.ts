import { Sequelize  } from 'sequelize-typescript';
import { Injectable, Query } from '@nestjs/common';
import {Model,QueryTypes,Op} from "sequelize"
import { User } from './user.schema';
import * as bcrypt from "bcrypt";
import {SequelizeModule,InjectModel} from "@nestjs/sequelize"
@Injectable()
export class UserServices{
    constructor(@InjectModel(User) private userModel:typeof User,private sequelize:Sequelize){}
    async signUp(userData:Partial<User>):Promise<User>{
        const salt=await bcrypt.genSalt(10);
        userData.password=await bcrypt.hash(userData.password,salt);
        return  await this.userModel.create(userData);
    }

    async signIn(email:String):Promise<User>{
       return await this.userModel.findOne({where:{email:email}});
    }

    async validatePassword(password:string, realPassword:string):Promise<User>{
       return await bcrypt.compare(password, realPassword);;
  }

  async requestOtp(email:String):Promise<any>{
    const expireTime = new Date();
    expireTime.setMinutes(expireTime.getMinutes() + 5);
    return await this.userModel.update({otp:1122,otpExpire:expireTime},{where:{email:email}})
  }
  async isExpired(email:String):Promise<any>{
    const now=new Date();
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
  async findByUUID(id:String):Promise<any>{
    return await this.userModel.findOne({where:{uuid:id}});
  }
  async getAll():Promise<any>{
    const [result]=await this.sequelize.query('select * from users where deleted=false');
    return result;
  }
}