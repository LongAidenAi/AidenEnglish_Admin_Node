import { Request, Response, NextFunction } from 'express';
import * as transcriptHttps from './transcript.https';
import * as transcriptService from './transcript.service';
import * as podcastService from '../podcast/podcast.service';
import {  arrangeEpisodesTranscriptData, arrangeTranscriptData, arrangeTranscriptInfo, convertToArray, findMissFilesInLocalFiles, formatfileName } from './transcript.middleware';
import fs from 'fs'

enum FilePath {
    localPath = 'F:/Work_Resources/AidenEnglish_Project/cloud_backup/baidu_disk/apps/aidenenglish/podcasts',
    baiduUploadPath = '/apps/aidenenglish/podcasts'
}

/**
 * 将音频转录为文字稿后保留在本地
 */
export const saveTranscriptInLocal = async (
  request: Request,
  response: Response,
  next: NextFunction
) => { 
  const {id_spotify,addAgain} = request.query
  try {
      const episodesInfo = await transcriptService.getEpisodesInfo(String(id_spotify),addAgain)
      const episodesInfoList = convertToArray(episodesInfo)

      let localFileDir: string;
      let errorHandler: any[] = [];
      let counter = 0;
      await Promise.all(episodesInfoList.map(async (item: any, index: number) => {
        if (item.transcript_sign === '0') {
              const fileName = formatfileName(item);
              localFileDir = `${FilePath.localPath}/${fileName.podcastDir}`;
              const localFilePath = `${localFileDir}/${fileName.episodeDir}.json`;
              
              // 文本本地操作和上传至百度网盘
              try {
                // 判断本地目录是否存在，如果不存在则创建
                if (!fs.existsSync(localFileDir)) fs.mkdirSync(localFileDir);
                // 判断本地文件是否存在，如果不存在则写入
                if (!fs.existsSync(localFilePath)) {
                  const transcriptInfoJSON = await deepgramProccess(item.audioUrl);
                  fs.writeFileSync(localFilePath, transcriptInfoJSON);
                  console.log(`${++counter}:  ${fileName.episodeDir}.json，写入成功`)
                }
              } catch (error) {
                errorHandler.push(item.id)
                console.error(`episode_id为: ${item.id} ,的文字稿存入本地失败：${error.message}`);
              }
          }
      }));

      const path = fs.readdirSync(localFileDir);
      const data = {
        message: `数据库导出共${episodesInfoList.length}项，目录存在${path.length}项,实际写入: ${counter}项`,
        errorHandler
      }
      console.log(`数据库导出共${episodesInfoList.length}项，目录存在${path.length}项,实际写入: ${counter}项`)
      counter = 0;
      response.status(201).send(data)
  } catch (error) {
    console.log(error.message)
      next({
          message: 'SAVE_TRANSCRIPT_IN_LOCAL_FAILED',
          originalError: error.message  
        });
  }

}
/**
 * 调用deepgram进行音频转文字
 */
const deepgramProccess = async (audioUrl: string) => {
  const DeepGramData = await transcriptHttps.apiDeepGramTranscribe(audioUrl)
  const transcriptInfo = await arrangeTranscriptInfo(DeepGramData)
  const transcriptInfoJSON = JSON.stringify(transcriptInfo);
  return transcriptInfoJSON
}


/**
 * 将文字稿保存到数据库
 */
export const saveTranscript = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const {id_spotify} = request.query
    const episodesInfo = await transcriptService.getEpisodesInfo(String(id_spotify),null)
    const episodesInfoList = convertToArray(episodesInfo)

    const resultArray = episodesInfoList.map((item: any, index: number) => {
            const fileName = formatfileName(item);
            const localFileDir = `${FilePath.localPath}/${fileName.podcastDir}`;
            const localFilePath = `${localFileDir}/${fileName.episodeDir}.json`;

            const localFile = fs.readFileSync(localFilePath, 'utf8');
            const transcriptData = JSON.parse(localFile);

            const transcriptInfo = arrangeTranscriptData(transcriptData,item.id)
            return transcriptInfo 
    });
    await transcriptService.saveTranscript(resultArray)
    await transcriptService.changeTranscriptSigns(String(id_spotify),'1')
    response.status(201).send()
    
  } catch (error) {
    next({
      message: 'SAVE_TRANSCRIPT_TO_DATABASE_FAILED',
      originalError: error.message  
    });
    
  }
}

/***
 * 修改音频路径，原因是有些音频路径重定向太多，超过了deepgram重定向的限制
 */
export const fixAudioUrl = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
  const {id_spotify,removeRedirectPath} = request.query

  const episodesInfo = await transcriptService.getEpisodesAudioUrlInfo(String(id_spotify))
  const episodesInfoList = convertToArray(episodesInfo)

  const regex = new RegExp(String(removeRedirectPath), 'g');

  episodesInfoList.forEach((item: { audioUrl: string; }) => {
    if (item.audioUrl) {
      item.audioUrl = item.audioUrl.replace(regex, '');
    }
  });
  try {
    await transcriptService.replaceAudioUrl(episodesInfoList)
    response.status(201).send()
  } catch (error) {
    console.log(error.message)
    next({
        message: 'FIX_AUDIO_URL_FAILED',
        originalError: error.message  
      });
  }
}

/***
 * 从数据库得到所有播客
 */
export const getAllPodcasts = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
      const allPodcastList = await podcastService.ObtainAllPodcasts()

      const AllPodcastInfoList = convertToArray(allPodcastList)

      const data = await Promise.all(AllPodcastInfoList.map(async (item: any, index: number) => {
        const transcript_sign = await transcriptService.judgeTranscriptSign(item.id_spotify)

        const specialCharsRegex = /[^\w\s]/g;
        const podcastDir = `${String(item.id)}.${String(item.podcast_name).replace(specialCharsRegex,'_')}`

        const localFileDir = `${FilePath.localPath}/${podcastDir}`;
        const path = fs.readdirSync(localFileDir);
        item.localfileLength = path.length;

        item.missingFiles = findMissFilesInLocalFiles(path)
        if(item.missingFiles.length > 0) {
          const missingFilesId = await transcriptService.getMissingFilesId(item.id,item.missingFiles) 

          const missingFilesIdList = convertToArray(missingFilesId)
          item.missingFilesId = missingFilesIdList.map((item: { id: any; }) => item.id);

        }
        if(transcript_sign === '1') {
          item.transcript_sign = 1
        } else {
          item.transcript_sign = 0
        }
        return item
      }));
      response.status(201).send(data)
  } catch (error) {
      next({
          message: 'GET_ALL_PODCAST_FAILED',
          originalError: error  
      })
  }
}