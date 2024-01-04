import { Request, Response, NextFunction } from 'express';
import * as transcriptHttps from './transcript.https';
import * as transcriptService from './transcript.service';
import { arrangeEpisodesTranscriptData, arrangeTranscriptInfo, convertToArray, formatfileName } from './transcript.middleware';
import fs from 'fs'
/***
 * 得到百度网盘文件目录
 */
export const getBaiduDiskFileList = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const data = await transcriptHttps.apiBaiduDiskFileList()
        response.status(201).send(data)
    } catch (error) {
        next({
            message: 'GET_BAIDU_DISK_FILE_LIST_FAILED',
            originalError: error  
          });
    }
}


enum FilePath {
    localPath = 'F:/Work_Resources/AidenEnglish_Project/cloud_backup/baidu_disk/apps/aidenenglish/podcasts',
    baiduUploadPath = '/apps/aidenenglish/podcasts'
}
/***
 * 
 */
export const transcribe = async (
    request: Request,
    response: Response,
    next: NextFunction
) => { 
    const {id_spotify} = request.query
    try {
        const episodesInfo = await transcriptService.getEpisodesInfo(String(id_spotify))
        
        const episodesInfoList = convertToArray(episodesInfo)

        const resultArray = await Promise.all(episodesInfoList.map(async (item: any, index: number) => {
          let i = 0
          let baiduData:any,episodes_transcriptInfo:any;

            if (item.transcript_sign === '0') {

              const transcriptInfoJSON = await deepgramProccess(item.audioUrl)
              
              const fileName = formatfileName(item);
              const localFileDir = `${FilePath.localPath}/${fileName.podcastDir}`;
              const localFilePath = `${localFileDir}/${fileName.episodeDir}.json`;
              const baiduFilePath = `${FilePath.baiduUploadPath}/${fileName.podcastDir}/${fileName.episodeDir}.json`;
          
              //文本本地操作和上传至百度网盘
              try {
                // 判断本地目录是否存在，如果不存在则创建
                if (!fs.existsSync(localFileDir)) fs.mkdirSync(localFileDir);
                // 判断本地文件是否存在，如果不存在则写入
                if (!fs.existsSync(localFilePath)) fs.writeFileSync(localFilePath, transcriptInfoJSON);
                // 读取本地文件
                const localFile = fs.readFileSync(localFilePath, 'utf8');

                baiduData = await transcriptHttps.apiBaiduDiskUpload(baiduFilePath,localFile,fileName.episodeDir);
              } catch (error) {
                throw new Error(`文本本地操作或上传至百度网盘失败，失败原因：${error.message}`);
              }

              episodes_transcriptInfo = arrangeEpisodesTranscriptData(item.id,baiduData)
              console.log(`${i + 1}:${fileName.podcastDir}/${fileName.episodeDir}.json 完成\n`)

            }
            
            return episodes_transcriptInfo; 
          }));
        
        await transcriptService.saveEpisodesTranscriptInfo(resultArray)
        console.log(`完成，共计${resultArray.length}项`)
        response.status(201).send(resultArray)
    } catch (error) {
        next({
            message: 'TRANSCRIBE_AUDIO_TO_TEXT_FAILED',
            originalError: error  
          });
    }

}

const deepgramProccess = async (audioUrl: string) => {
  const DeepGramData = await transcriptHttps.apiDeepGramTranscribe(audioUrl)
  const transcriptInfo = await arrangeTranscriptInfo(DeepGramData)
  const transcriptInfoJSON = JSON.stringify(transcriptInfo);
  return transcriptInfoJSON
}