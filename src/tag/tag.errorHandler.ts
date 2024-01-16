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
      case 'GET_TAG_LIST_FAILED':
        statusCode = 501;
        message = `服务端错误, 获取tag列表失败: ${error.originalError}`
        break;
      case 'SAVE_PODCAST_TAG_FAILED':
        statusCode = 501;
        message = `服务端错误, 保存播客标签失败: ${error.originalError}`
        break;
      case 'PODCAST_TAG_IS_EXIST':
        statusCode = 401;
        message = `此播客标签相关信息已存在`
        break;
      case 'PODCAST_IS_NOT_EXIST':
        statusCode = 401;
        message = `此播客不存在`
        break;
    }
    if(!statusCode) return next(error)
    response.status(statusCode).send({ message })
  }