import {Model,Column,Table,PrimaryKey,Default, ForeignKey} from "sequelize-typescript"
import { User } from "./user.schema"
@Table
export class AuthId extends Model{
@PrimaryKey
@Column
id:string
    
@Column
uuid:string

@ForeignKey(()=>User)
@Column
userId:string
}
export  interface AuthId extends Document{
     id:string,
     uuid:string,
     userId:string,
}