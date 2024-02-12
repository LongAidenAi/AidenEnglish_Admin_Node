import fs from 'fs'
import PDFDocument from 'pdfkit';
import { Request, Response, NextFunction } from 'express';
import * as transcriptHttps from '../transcript/transcript.https';
import * as transcriptService from '../transcript/transcript.service';
import * as podcastService from '../podcast/podcast.service';
import {  arrangeTranscriptInfo, convertToArray, sanitizeFilename } from '../transcript/transcript.middleware';
import axios from 'axios';
import path from 'path';



  enum FilePodcastPath {
    localPathJSON = 'F:/Work_Resources/AidenEnglish_Project/cloud_backup/aidenenglish/podcast_json_fix',
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