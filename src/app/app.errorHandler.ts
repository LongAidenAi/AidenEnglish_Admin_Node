import { Request, Response, NextFunction } from 'express';

/**
 * 默认异常处理器   
 */
export const appErrorHandler = (
    error: any,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    let statusCode: number, message: string;
  
    switch (error.message) {
      case 'GET_SPOTIFY_TOKEN_FAILED':
        statusCode = 501;
        message = "服务器错误, 获取spotify_token失败"
        break;
      default:
          statusCode = 500;
          message = "服务器出了一点问题"
      break;
    }

    response.status(statusCode).send({ message })
  }