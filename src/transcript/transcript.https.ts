import axios from 'axios';
import { srt} from "@deepgram/sdk";
import {apiDiskBaidu, apiDiskBaiduUpload} from '../app/connect/baiduDisk'
import { deepgram } from '../app/connect/deepgram';
import fs from 'fs'


enum BaiduDiskFileList {
    path = '/rest/2.0/xpan/file',
    method = 'list'
}

enum BaiduDiskFlieListAll {
    path = '/rest/2.0/xpan/multimedia',
    method = 'listall'
}

/***
 * 初始化百度网盘
 */
export const apiBaiduDiskFileList = async (
    
) => {
    try {
        const response = await apiDiskBaidu.get(BaiduDiskFlieListAll.path,{
            params: {
                method: BaiduDiskFlieListAll.method
            }
        })
        return response.data
    } catch (error) {
        throw new Error('调用百度网盘获取文件列表api失败');
    }
}

/***
 * 请求deepgram接口
 */
export const apiDeepGramTranscribe = async (
    audioUrl: string
) => {
    try {
        const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
            {
              url: audioUrl,
            },
            {
              model: "nova-2",
              summarize: 'v2'
            }
          );

        if (error) {
            console.log(error.message)
            throw new Error('调用deepgram的api转换音频到文本失败');
        }

        return result

    } catch (error) {
        throw new Error(error.message);
    }
}


/***
 * 文件上传至百度网盘
 */
export const apiBaiduDiskUpload = async (
    baiduFilePath: string,
    localFile: string,
    fileName: string
) => {
    try {
        //创建包含文件内容的 Blob 对象
        const blob = new Blob([localFile], { type: 'application/json' });
        //创建 FormData 对象，并将 Blob 添加到其中
        const formData = new FormData();
        // 将 Blob 添加到 FormData 中
        formData.append('uploadFile', blob, `${fileName}.json`); 

        const response = await apiDiskBaiduUpload.post('/rest/2.0/pcs/file', formData, { 
            params: {
              path: baiduFilePath,
            }
          });
        return response.data

    } catch (error) {
        throw new Error('调用百度网盘上传文件api失败');
    }
}