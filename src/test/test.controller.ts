import { Request, Response, NextFunction } from 'express';
import * as testHttps from './test.https';
import * as podcastHttps from '../podcast/podcast.https';
import * as transcriptService from '../transcript/transcript.service';
import { arrangeTranscriptData, convertToArray, formatfileName } from '../transcript/transcript.middleware';
import fs from 'fs'
import * as testService from './test.service'
/***
 * 
 */
export const deepgram = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {episodeAudioUrl} = request.query
    try {
        const data = await testHttps.deepgramAPI(String(episodeAudioUrl))
        response.status(201).send(data)
    } catch (error) {
    }
}


export const searchSpotifyPodcast = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {

    const {headers: {authorization},body:{data: {spotifyPodcastUrl}}} = request
    const spotifyToken = authorization.split(' ')[1];

    const regex = /\/show\/([a-zA-Z0-9]+)\?/;
    const match = spotifyPodcastUrl.match(regex);
    if (match && match[1]) {
      const data = match[1];
      const id_spotify = data

      try {
        const spotifyData = await podcastHttps.searchSpotifyPodcast({spotifyToken,id_spotify}) 
        response.status(201).send(spotifyData)

      } catch (error) {
        console.log(error.message)
      }

    } else {
      console.log("无效路径");
    }

}

enum FilePath {
  localPath = 'F:/Work_Resources/AidenEnglish_Project/cloud_backup/baidu_disk/apps/aidenenglish/podcasts',
}
/***
 * 
 */
export const saveTranscript = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {

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
      const data = await testService.saveTranscript(resultArray)
      response.status(201).send(resultArray)
    try {
      
    } catch (error) {
      console.log(error.message)
      
    }
}