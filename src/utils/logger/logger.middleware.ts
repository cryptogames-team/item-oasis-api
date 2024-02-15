import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response, NextFunction } from 'express';
import { winstonLogger } from './logger.util';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class LoggerMiddleware implements NestMiddleware {
  constructor() {}
  use(req: Request, res: Response, next: NextFunction) {
    const { ip, method, originalUrl } = req;
    const userAgent = req.get('user-agent');
    const token = req.headers.authorization?.split(' ')[1];
    if(token){
      try {
        const decodeToken = jwt.verify(token,process.env.JWT_SCRET_KEY) as {user_name: string}
        winstonLogger.log(`[${method}]${originalUrl} ${ip} ${decodeToken.user_name}`);
      }catch(error){
        winstonLogger.log(`[${method}]${originalUrl} ${ip} ${userAgent}`);
      }
    }else {
      winstonLogger.log(`[${method}]${originalUrl} ${ip} ${userAgent}`);
    }
    res.on('finish', () => {
      const { statusCode } = res;
      if (statusCode >= 400 && statusCode < 500)
        winstonLogger.warn(`[${method}]${originalUrl}(${statusCode}) ${ip} ${userAgent}`);
      else if (statusCode >= 500) winstonLogger.error(`[${method}]${originalUrl}(${statusCode}) ${ip} ${userAgent}`);
    });

    next();
  }
}