import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserServices } from "./user.services";
import { User } from "./user.schema";
import {SequelizeModule} from "@nestjs/sequelize"

@Module({
    imports:[SequelizeModule.forFeature([User])],
    controllers:[UserController],
    providers:[UserServices]
})
export class UserModule {}
