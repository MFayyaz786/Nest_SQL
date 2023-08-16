import { ExceptionFilter, Catch, ArgumentsHost, HttpException, HttpStatus } from '@nestjs/common';
import { Request, Response } from 'express';
import { UniqueConstraintError } from 'sequelize';

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let msg = 'Internal Server Error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      msg = exception.message;
      console.log('exception', exception.message);
    } else if (exception instanceof Error && exception['name'] === 'SequelizeDatabaseError') {
      status = HttpStatus.BAD_REQUEST;
      msg = 'Sequelize database error';
      console.log('Sequelize database error:', exception.message);
    }else if (exception instanceof UniqueConstraintError) {
      status = HttpStatus.BAD_REQUEST;
      msg = exception.original.message;
      console.log('Unique constraint violation:', exception.original.message);
    }
     else if (exception instanceof Error && exception['code'] === 'ER_DUP_ENTRY') {
              console.log('Sequelize database error:', exception.message);

      status = HttpStatus.BAD_REQUEST;
      msg = 'Duplicate entry';
    }

    response.status(status).json({
      statusCode: status,
      path: request.url,
      msg: msg,
    });
  }
}
