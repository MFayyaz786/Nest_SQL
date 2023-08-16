import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as morgan from "morgan"
import * as dotenv from "dotenv"
import {Request,Response} from "express"
import logger from "./middleware/logger.middleware"
import * as bodyParser from 'body-parser';
async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(AppModule);
  app.use(morgan("dev"));
  // Create a custom logging function to capture path, method, and request
  app.use(bodyParser.json())
  app.use(logger); 
  app.use("/",(req:Request,res:Response,next:Function)=>{
    console.log(`Route Called ${req.originalUrl}`);
    next();
  });
  await app.listen(process.env.PORT);
}
bootstrap();
