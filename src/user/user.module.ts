import { Module } from "@nestjs/common";
import { UserController } from "./user.controller";
import { UserServices } from "./user.services";
import { User } from "./user.schema";
import {SequelizeModule} from "@nestjs/sequelize"
import { AuthId } from "./auth.schema";
import { AuthServices } from "./auth.services";

@Module({
    imports:[SequelizeModule.forFeature([User,AuthId])],
    controllers:[UserController],
    providers:[UserServices,AuthServices]
})
export class UserModule {}
