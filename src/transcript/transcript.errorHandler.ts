import { Request, Response, NextFunction } from 'express';

/**
 * 默认异常处理器   
 */
export const transcriptErrorHandler = (
    error: any,
    request: Request,
    response: Response,
    next: NextFunction
  ) => {
    let statusCode: number, message: string;

    switch (error.message) {
      case 'GET_BAIDU_DISK_FILE_LIST_FAILED':
        statusCode = 501;
        message = `服务端错误, 获取百度网盘文件列表失败: ${error.originalError}`
        break; 
      case 'TRANSCRIBE_AUDIO_TO_TEXT_FAILED':
        statusCode = 501;
        message = `服务端错误, 音频转文字失败: ${error.originalError}`
        break;  
    }

    if(!statusCode) return next(error)
    response.status(statusCode).send({ message })
  }