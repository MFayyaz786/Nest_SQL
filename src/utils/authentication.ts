import { Request, Response, NextFunction } from 'express';
import { HttpStatus } from '@nestjs/common';
import jwtServices from './jwtServices';
export async function authentication(req: Request, res: Response, next: NextFunction) {
  const excludedPaths = [
    '/api/v1/test',
    '/api-docs',
    '/login1',
    '/refreshToken'
    // Add other URL conditions here
  ];

  if (excludedPaths.some(path => req.url.startsWith(path) || req.url.endsWith(path))) {
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
      return res.status(HttpStatus.UNAUTHORIZED).json({ msg: 'Authentication failed' });
    }
  } catch (error) {
    if (error.message === 'jwt expired') {
      res.status(HttpStatus.UNAUTHORIZED).json({ msg: 'Authentication failed' });
    } else {
      res.status(HttpStatus.UNAUTHORIZED).json({ msg: error.message });
    }
  }
}
