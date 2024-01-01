import { Request, Response, NextFunction } from 'express';

/**
 * 默认异常处理器   
 */
export const podcastErrorHandler = (
    error: any,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    let statusCode: number, message: string;

    switch (error.message) {
      case 'SEARCH_NEW_PODCAST_FAILED':
        statusCode = 501;
        message = `服务端错误，搜索新播客失败: ${error.originalError}`
        break;
      case 'ADD_NEW_PODCAST_FAILED':
        statusCode = 501;
        message = `服务端错误, 添加新播客失败: ${error.originalError}`
        break;  
      case 'GET_ALL_PODCAST_FAILED':
        statusCode = 501;
        message = `服务端错误, 获取所有播客失败: ${error.originalError}`
        break;  
      case 'DELETE_PODCAST_FAILED':
        statusCode = 501;
        message = `服务端错误, 删除播客失败: ${error.originalError}`
        break;  
      case 'UPDATE_PODCAST_FAILED':
        statusCode = 501;
        message = `服务端错误, 更新播客失败: ${error.originalError}`
        break;  
      case 'PODCAST_IS_ALREADY_EXIST':
        statusCode = 401;
        message = `此播客已存在`
        break;  
      case 'PODCAST_DOES_NOT_EXIST':
        statusCode = 401;
        message = `此播客不存在`
        break;  
      case 'ARRANGE_PODCAST_DESCRIPTION_FAILED':
        statusCode = 501;
        message = `服务端错误，通过openai整理播客的description失败`
        break;  
      case 'openai_failed':
        statusCode = 501;
        message = `服务端错误，openai调用失败`
        break;  
    }
    if(!statusCode) return next(error)
    response.status(statusCode).send({ message })
  }