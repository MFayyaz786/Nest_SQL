import { Controller, Get,Res } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  getHello(@Res() res): string {
  return res.json("Welcome to Nest SQL Server");
    //return this.appService.getHello();
  }
}
