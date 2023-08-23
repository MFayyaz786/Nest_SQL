import { Request, Response, NextFunction } from 'express';
import { NestMiddleware,Injectable } from '@nestjs/common';
import { HttpStatus } from '@nestjs/common';
import jwtServices from '../utils/jwtServices';
@Injectable()
export class Authentication implements NestMiddleware{
    excludedPaths = [
    '/auth/all',
    '/api-docs',
    '/login1',
    '/refreshToken'
    // Add other URL conditions here
  ];
async use(req: Request, res: Response, next: NextFunction) {
  if (this.excludedPaths.some(path => req.originalUrl.startsWith(path) || req.originalUrl.endsWith(path))) {
    next();
    return;
  }
  const authorizationHeader = req.headers.authorization;
  if (!authorizationHeader) {
    return res.status(HttpStatus.UNAUTHORIZED).json({ msg: 'Authentication failed!' });
  }
  const token = authorizationHeader.slice(7); // Remove 'Bearer ' prefix
  try {
    const tokenData = await jwtServices.authenticate(token);
    if(tokenData){
    next();
    }else{
      return res.status(HttpStatus.UNAUTHORIZED).json({ msg: 'Authentication failed!' });
    }
  } catch (error) {
    if (error.message === 'jwt expired') {
      res.status(HttpStatus.UNAUTHORIZED).json({ msg: 'Authentication failed!' });
    } else {
      res.status(HttpStatus.UNAUTHORIZED).json({ msg: error.message });
    }
  }
}
}
