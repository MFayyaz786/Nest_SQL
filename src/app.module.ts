import { Module,MiddlewareConsumer ,NestModule } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { databaseProviders } from './database.providers';
import {SequelizeModule} from "@nestjs/sequelize"
import { UserModule } from './user/user.module';
import { User } from './user/user.schema';
import { APP_FILTER, MiddlewareBuilder } from '@nestjs/core';
import { GlobalExceptionFilter } from './middleware/globelErrorHandler';
import { Authentication } from './middleware/authentication.middleware';

@Module({
  imports: [SequelizeModule.forRoot({
      dialect: 'mysql',
      host: 'localhost',
      port: 3306,
      username: 'root',
      password: 'Star',
      database: 'Nest_Test',
      models: [User],
      autoLoadModels:true,
      synchronize: true,
    }),UserModule],
  controllers: [AppController],
  providers: [AppService,{provide:APP_FILTER,
useClass:GlobalExceptionFilter}],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(Authentication)
      .forRoutes('*'); // Apply the middleware to all routes
  }
}
//export class AppModule {}
