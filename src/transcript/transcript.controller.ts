import fs from 'fs'
import PDFDocument from 'pdfkit';
import { Request, Response, NextFunction } from 'express';
import * as transcriptHttps from './transcript.https';
import * as transcriptService from './transcript.service';
import * as podcastService from '../podcast/podcast.service';
import {  arrangeEpisodesTranscriptData, arrangeTransToPDF, arrangeTranscriptData, arrangeTranscriptInfo, convertToArray, downloadAudio, findMissFilesInLocalFiles, formatfileName, jointTranscript, sanitizeFilename } from './transcript.middleware';
import axios from 'axios';
import path from 'path';

enum FilePodcastPath {
  localPathJSON = 'F:/Work_Resources/AidenEnglish_Project/cloud_backup/aidenenglish/podcast_json',
  localPath = 'F:/Work_Resources/AidenEnglish_Project/cloud_backup/aidenenglish/podcast'
}
/**
 * 将音频转录为文字稿后保留在本地
 */
export const saveTranscriptInLocal = async (
  request: Request,
  response: Response,
  next: NextFunction
) => { 
  const {podcast_id,addAgain} = request.query
  try {
      const episodesInfo = await transcriptService.getEpisodesInfo(Number(podcast_id),addAgain)
      const episodesInfoList = convertToArray(episodesInfo)
      
      let errorHandler: any[] = [];
      let counter = 0;
      const podcastName = sanitizeFilename(episodesInfo[0].podcast_name)
      const podcastDir = `${FilePodcastPath.localPathJSON}/${episodesInfo[0].podcast_id}.${podcastName}`
      await Promise.all(episodesInfoList.map(async (item: any, index: number) => {
        if (item.transcript_sign === 0) {
          
          const episodeName = sanitizeFilename(item.name)

          const localFilePath = `${podcastDir}/${item.episodeNumber}.${episodeName}.json`
          
          try {
            // 判断本地目录是否存在，如果不存在则创建
            if (!fs.existsSync(podcastDir)) fs.mkdirSync(podcastDir, { recursive: true });

            // 判断本地文件是否存在，如果不存在则写入
            if (!fs.existsSync(localFilePath)) {
            await new Promise<void>(resolve => {
              let i = index
              setTimeout(() => {
                resolve(); 
              }, i * 300);
            });
              const transcriptInfoJSON = await deepgramProccess(item.audio_url);

              fs.writeFileSync(localFilePath, transcriptInfoJSON);

              console.log(`${++counter}:  ${item.episodeNumber}.${episodeName}.json: 写入成功`)
            }
          } catch (error) {
              errorHandler.push(item.id)
              console.error(`episode_id为: ${item.id} ,的文字稿存入本地失败：${error.message}`);
          }
        }
      }));

      const path = fs.readdirSync(podcastDir);
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
  // const DeppGramSummary = await transcriptHttps.apiDeepGramSummary(audioUrl)
  const transcriptInfo = await arrangeTranscriptInfo(DeepGramData)
  const transcriptInfoJSON = JSON.stringify(transcriptInfo);
  return transcriptInfoJSON
}
// 延迟函数
// const delay = (ms: number) => {
//   console.log(ms)
//   return new Promise(resolve => setTimeout(resolve, ms));
// }

/**
 * 将文字稿保存到数据库
 */
export const uploadTranscript = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  try {
    const {podcast_id} = request.query
  
    const episodesInfo = await transcriptService.getEpisodesInfo(Number(podcast_id),null)
    const episodesInfoList = convertToArray(episodesInfo)

    const podcastName = sanitizeFilename(episodesInfo[0].podcast_name)
    const podcastDir = `${FilePodcastPath.localPathJSON}/${episodesInfo[0].podcast_id}.${podcastName}`

    const promises = await episodesInfoList.map(async (item: any, index: number) => {

        if (item.transcript_sign === 0) {
          const episodeName = sanitizeFilename(item.name)
          const localFilePath = `${podcastDir}/${item.episodeNumber}.${episodeName}.json`
          
          const transcriptFile = fs.readFileSync(localFilePath, 'utf8');
          const transcriptData = JSON.parse(transcriptFile);
  
          const transcriptInfo = arrangeTranscriptData(transcriptData,item)
  
          await transcriptService.saveTranscript([transcriptInfo])
          console.log(`播客${podcast_id}, 第${item.episodeNumber}集，文字稿存入数据库成功`)
          await transcriptService.changeTranscriptSigns(
            Number(podcast_id),Number(transcriptInfo.episode_id),1,Number(transcriptInfo.episodeNumber))
          return transcriptInfo 
        }


    });
    await Promise.all(promises);
    response.status(201).send()
    
  } catch (error) {
    console.log(error)
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
  const {podcast_id,removeRedirectPath} = request.query

  const episodesInfo = await transcriptService.getEpisodesAudioUrlInfo(String(podcast_id))
  const episodesInfoList = convertToArray(episodesInfo)

  const regex = new RegExp(String(removeRedirectPath), 'g');

  episodesInfoList.forEach((item: { audio_url: string; }) => {
    if (item.audio_url) {
      item.audio_url = item.audio_url.replace(regex, '');
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
 * 从数据库得到所有播客以及每期是否有文字稿的信息
 */
export const getAllPodcasts = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
    try {
      const allPodcastList = await transcriptService.getAllPocastsShortInfo()
      const AllPodcastInfoList = convertToArray(allPodcastList)

      
      const data = await Promise.all(AllPodcastInfoList.map(async (item: any, index: number) => {
        const transcriptInfo = await transcriptService.getTranscriptInfo(item.id)

        if(transcriptInfo.transcript_sign === 0) {
          item.transcript_sign = 0
          item.audio_url = transcriptInfo.audio_url
        } else {
          item.transcript_sign = 1
        }

        const podcastName = sanitizeFilename(item.podcast_name)
        const podcastDir = `${FilePodcastPath.localPath}/${item.id}.${podcastName}`
        if(!fs.existsSync(podcastDir)) {
          item.packLocal = 0
        } else {
          item.packLocal = 1
        }

        return item
      }))
      response.status(201).send(data)
    } catch (error) {
        next({
          message: 'GET_ALL_PODCAST_SHORT_INFO_FAILED',
          originalError: error  
      })
    }
}



/***
 * //数据库获取到音频和存文字稿，存入本地，方便之后开通买断某个播客的付费模式
 */
// export const packToLocal = async (
//     request: Request,
//     response: Response,
//     next: NextFunction
// ) => {
//   const {podcast_id} = request.query
//     try {
//       const episodesInfo = await transcriptService.getEpisodesInfoPack(Number(podcast_id))
//       const episodesInfoList = convertToArray(episodesInfo)

//       const podcastName = sanitizeFilename(episodesInfo[0].podcast_name)
//       const podcastDir = `${FilePodcastPath.localPath}/${episodesInfo[0].podcast_id}.${podcastName}`

//       if (!fs.existsSync(podcastDir)) fs.mkdirSync(podcastDir, { recursive: true });

//       episodesInfoList.forEach(async (item:any) => {
//         item.name = sanitizeFilename(item.name);
//         const episodeDir = `${podcastDir}/${item.episodeNumber}.${item.name}`;
//         if (!fs.existsSync(episodeDir)) {
//           fs.mkdirSync(episodeDir, { recursive: true });
//         }

//         const episodePathPDF = `${episodeDir}/${item.episodeNumber}.${item.name}.pdf`
//         if(!fs.existsSync(episodePathPDF)) arrangeTransToPDF(item, episodePathPDF);
        
//         const episodePathMP3 = `${episodeDir}/${item.episodeNumber}.${item.name}.mp3`
//         if(!fs.existsSync(episodePathMP3)) await downloadAudio(item, episodePathMP3)
        
//       });

//     } catch (error) {
//       next({
//         message: 'PACK_TO_LOCAL_FAILED',
//         originalError: error.message  
//       });
//     }
// }

export const packToLocal = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
const {podcast_id} = request.query
  try {
    const episodesInfo = await transcriptService.getEpisodesInfoPack(Number(podcast_id))
    const episodesInfoList = convertToArray(episodesInfo)

    const podcastName = sanitizeFilename(episodesInfo[0].podcast_name)
    const podcastDir = `${FilePodcastPath.localPath}/${episodesInfo[0].podcast_id}.${podcastName}`

    if (!fs.existsSync(podcastDir)) fs.mkdirSync(podcastDir, { recursive: true });

    const getDirectoryRangeForEpisode = (episodeNumber: number) => {
      const rangeSize = 10;
      const startRange = Math.floor((episodeNumber - 1) / rangeSize) * rangeSize + 1;
      const endRange = startRange + rangeSize - 1;
      return `${startRange}-${endRange}`;
    };

    let errorHandler: any[] = [];
    // 初始化操作完成计数器
    let completedCount = 0; 
    // 使用 for...of 循环来确保异步行为的顺序
    for (const item of episodesInfoList) {
      item.name = sanitizeFilename(item.name);
      const directoryRange = getDirectoryRangeForEpisode(item.episodeNumber);
      const episodeRangeDir = path.join(podcastDir, directoryRange);
    
      // 文字稿和音频目录
      const textDir = path.join(episodeRangeDir, '文字稿');
      const audioDir = path.join(episodeRangeDir, '音频');
    
      try {
        if (!fs.existsSync(textDir)) {
          fs.mkdirSync(textDir, { recursive: true });
        }
        if (!fs.existsSync(audioDir)) {
          fs.mkdirSync(audioDir, { recursive: true });
        }
      
        // 文字稿和音频文件的路径
        const episodePathPDF = path.join(textDir, `${item.episodeNumber}.${item.name}.pdf`);
        const episodePathMP3 = path.join(audioDir, `${item.episodeNumber}.${item.name}.mp3`);
      
        // 处理文字稿文件
        if (!fs.existsSync(episodePathPDF)) {
          arrangeTransToPDF(item, episodePathPDF); // 假设这是一个同步函数
        }
        
        // 处理音频文件
        if (!fs.existsSync(episodePathMP3)) {
          // 由于这是一个异步函数，我们在这里等待它
          const status = await downloadAudio(item, episodePathMP3);
          if(!status) {
            errorHandler.push(item.id)
          }
        }
  
        completedCount++; 
      } catch (error) {
        console.error(`episode_id为: ${item.id} ,从数据库存储pdf或mp3失败：${error.message}`);
      }
     
    }
    const data = {
      message: `数据库导出共${episodesInfoList.length}项,实际写入: ${completedCount}项`,
      errorHandler
    }
    completedCount = 0
    response.status(201).send(data)
  } catch (error) {

    next({
      message: 'PACK_TO_LOCAL_FAILED',
      originalError: error.message  
    });
  }
}