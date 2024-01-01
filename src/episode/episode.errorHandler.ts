import { Request, Response, NextFunction } from 'express';

/**
 * 默认异常处理器   
 */
export const episodeErrorHandler = (
    error: any,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    let statusCode: number, message: string;

    switch (error.message) {
      case 'SEARCH_EPISODES_FAILED':
        statusCode = 501;
        message = `服务端错误, 搜索episodes失败: : ${error.originalError}`
        break;  
      case 'DELETE_EPISODES_FAILED':
        statusCode = 501;
        message = `服务端错误, 删除episodes失败: : ${error.originalError}`
        break;  
    }

    if(!statusCode) return next(error)
    response.status(statusCode).send({ message })
  }