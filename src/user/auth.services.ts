import { Sequelize  } from 'sequelize-typescript';
import { Injectable, Query } from '@nestjs/common';
import {Model,QueryTypes,Op} from "sequelize"
import { AuthId } from './auth.schema';
import {SequelizeModule,InjectModel} from "@nestjs/sequelize"
@Injectable()
export class AuthServices{
    constructor(@InjectModel(AuthId) private AuthModel:typeof AuthId,private sequelize:Sequelize){}
    async add(userId:String,uuid:String):Promise<AuthId>{
    const result= await this.AuthModel.create({userId,uuid});
    return  result
    }
  async findByUUID(id:String):Promise<any>{
    //  const query = `
    //   SELECT * FROM AuthIds
    //   WHERE uuid ='${id}'`;
    // const [results] = await this.sequelize.query(query);
    // return results
    return await this.AuthModel.findOne({where:{uuid:id}});
  }
}