import {Model,Column,Table,PrimaryKey,Default} from "sequelize-typescript"
import {Sequelize,DataTypes} from "sequelize"
@Table
export class User extends Model{
// @PrimaryKey
// @Column({ type:'uuid', defaultValue: Sequelize.literal('gen_random_uuid()') })
// id: string;

@Column
name:string

@Column({unique:true})
email:string

@Column
password:string

@Column
otp:number

@Default(DataTypes.NOW)
@Column
otpExpire:Date
}
export  interface User extends Document{
     id:string,
     name:string,
     email:string,
     password:string,
     otp:number,
     otpExpire:Date
}