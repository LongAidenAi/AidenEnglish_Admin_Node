import { Request, Response, NextFunction } from 'express';

/**
 * 默认异常处理器   
 */
export const tagErrorHandler = (
    error: any,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    let statusCode: number, message: string;

    switch (error.message) {
      case 'WORD_ANALYSIS_FAILED':
        statusCode = 501;
        message = `服务端错误，词频分析失败: ${error.originalError}`
        break;
    }
    if(!statusCode) return next(error)
    response.status(statusCode).send({ message })
  }