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
      case 'SAVE_TRANSCRIPT_IN_LOCAL_FAILED':
        statusCode = 501;
        message = `服务端错误,  文字稿存入本地失败: ${error.originalError}`
        break;  
      case 'FIX_AUDIO_URL_FAILED':
        statusCode = 501;
        message = `服务端错误, 替换每期播客新的audioUrl失败: ${error.originalError}`
        break;  
      case 'UPLOAD_TRANSCRIPT_TO_BAIDUDISK_FAILED':
        statusCode = 501;
        message = `服务端错误, 将本地文字稿上传至百度网盘失败: ${error.originalError}`
        break;  
      case 'SAVE_TRANSCRIPT_TO_DATABASE_FAILED':
        statusCode = 501;
        message = `服务端错误, 将本地文字稿存储至数据库失败: ${error.originalError}`
        break; 
      case 'GET_ALL_PODCAST_SHORT_INFO_FAILED':
        statusCode = 501;
        message = `服务端错误, 获取包含文字稿是否存在状态的播客信息失败: ${error.originalError}`
        break; 
      case 'PACK_TO_LOCAL_FAILED':
        statusCode = 501;
        message = `服务端错误, 将音频和文字稿打包存入本地失败: ${error.originalError}`
        break
    }

    if(!statusCode) return next(error)
    response.status(statusCode).send({ message })
  }