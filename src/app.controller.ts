import { Controller, Get, Res, Req, Post, HttpStatus,Body } from '@nestjs/common';
import { AppService } from './app.service';
import {encryptObject,decryptObject} from "./utils/encryptionService"


@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}
  
  @Post('encrypt')
  encryption(@Req() req,@Res() res,@Body() body):any{
    console.log("body",body)
      return  res.status(HttpStatus.OK).json(encryptObject(body));
  }

  @Post('decrypt')
  decryption(@Req() req,@Res() res,@Body() body):any{
   return res.status(HttpStatus.OK).json(decryptObject(body?.cipher));
  }

  @Get()
  getHello(@Res() res): string {
  return res.json("Welcome to Nest SQL Server");
    //return this.appService.getHello();
  }
}
