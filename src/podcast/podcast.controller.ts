import { Request, Response, NextFunction } from 'express';
import axios from 'axios';
import sharp from 'sharp';
import * as podcastHttps from './podcast.https';
import * as podcastService from './podcast.service';
import { arrangeSearchNewPodcastInfo, arrangeUpdatePodcastInfo,filterDescTool } from './podcast.middleware';
import * as episodeHttps from '../episode/episode.https';
import { convertToArray } from '../transcript/transcript.middleware';
import { arrangeUpdateEpisodesInfo } from '../episode/episode.middleware';
import * as episodeService from '../episode/episode.service'




/***
 * 搜索新播客
 */
export const searchNewPodcast = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {headers: {authorization},body:{data: {podcast_name,id_spotify}}} = request
    const spotifyToken = authorization.split(' ')[1];
    try {
        const spotifyData = await podcastHttps.searchSpotifyPodcast({spotifyToken,id_spotify})
        
        const taddyData = await podcastHttps.searchTaddyPodcast(String(podcast_name))
        
        const searchPodcastInfo = await arrangeSearchNewPodcastInfo(spotifyData,taddyData)

        response.status(201).send(searchPodcastInfo)
    } catch (error) {
        next({
            message: 'SEARCH_NEW_PODCAST_FAILED',
            originalError: error  
          });
    }
}

/***
 * 向数据库添加新的播客
 */
export const addNewPodcast = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {newPodcast} = request.body.data
    
    try { 
        const data = await podcastService.saveNewPodcastInfo(newPodcast)
        response.status(201).send(data)
    } catch (error) {
        console.log(error.response)
        next({
            message: 'ADD_NEW_PODCAST_FAILED',
            originalError: error  
        })
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
        const data = await podcastService.ObtainAllPodcasts()
        
        response.status(201).send(data)
    } catch (error) {
        next({
            message: 'GET_ALL_PODCAST_FAILED',
            originalError: error  
        })
    }
}

/***
 * 删除数据库中的播客
 */
export const deletePodcast = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {id_spotify} = request.query
    try {
        const data = await podcastService.deletePodcastById(String(id_spotify))

        response.status(201).send(data)
    } catch (error) {
        next({
            message: 'DELETE_PODCAST_FAILED',
            originalError: error  
        })
    }
}

/***
 * 更新播客到数据库
 */
export const updatePodcast = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {headers: {authorization},body: {data: {updateInfo}}} = request
    const spotifyToken = authorization.split(' ')[1];
    
    try {
        const DNumber = updateInfo.total_episodes_spotify - updateInfo.total_episodes_taddy
        const updateNumbers =updateInfo.total_episodes_taddy - updateInfo.total_episodes_database

        const spotifyEpisodes = await podcastHttps.getSpotifyEpisodes({spotifyToken,id_spotify: updateInfo.id_spotify})
        const previewAudioList = spotifyEpisodes.items.slice(DNumber, DNumber + updateNumbers );

        const taddyData = await podcastHttps.getTaddyUpdateEpisodes(updateInfo.id_taddy,updateNumbers)
        taddyData.episodes.reverse()
        
        const updateEpisodesInfo = arrangeUpdateEpisodesInfo(updateInfo, updateNumbers,previewAudioList, taddyData)

        await episodeService.saveEpisodes(updateEpisodesInfo, 0) 
        console.log('')
        response.status(201).send(updateEpisodesInfo)

    } catch (error) {
        next({
            message: 'UPDATE_PODCAST_FAILED',
            originalError: error  
          });
    }

}


const formatData = (timestamp: any) => {
    // 将时间戳转换成日期
    const date = new Date(timestamp * 1000); 
    // 填充0函数，确保月份和日期是两位数
    const pad = (num: number): string => (num < 10 ? `0${num}` : num.toString());
  
    // 获取格式化的日期部分
    const formattedDate = `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
    return formattedDate
  }


/***
 * 调用openai整理播客description的数据
 */
export const arrangedesc = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {description,switchHand} = request.query

    try {
        if(switchHand == 'true') {
            // const dataReject = filterDescTool(String(description))

             //百度api
            const dataTrans = await episodeHttps.transDescTool(String(description))

            response.status(201).send({dataTrans})
        } else {
            // //剔除引流链接
            // const dataReject = await podcastHttps.rejectDescLink(String(description))
            const dataReject = filterDescTool(String(description))

            //百度api
            const dataTrans = await episodeHttps.transDescTool(String(dataReject))

            response.status(201).send({dataReject,dataTrans})
        }
    } catch (error) {
        next(new Error('ARRANGE_PODCAST_DESCRIPTION_FAILED'));
    }
}


export const searchPodcastUpdate = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {headers: {authorization}} = request
    const spotifyToken = authorization.split(' ')[1];

    try {
        const podcastUpdateInfo = await podcastService.getPodcastUpdateInfo()
        const podcastList = convertToArray(podcastUpdateInfo)

        const podcastData = await Promise.all(podcastList.map(async (item:any) => {
            const spotifyData = await podcastHttps.searchSpotifyPodcast({spotifyToken,id_spotify: item.id_spotify})
            const total_episodes_taddy = await podcastHttps.searchTaddyPodcastInfo(item.id_taddy)
            
            if(item.total_episodes_taddy < total_episodes_taddy) {
                return {
                    podcast_id: item.id,
                    id_taddy: item.id_taddy,
                    id_spotify: item.id_spotify,
                    podcast_name: item.podcast_name,
                    podcast_image: item.image_spotify,
                    total_episodes_database: item.total_episodes_taddy,
                    total_episodes_taddy,
                    total_episodes_spotify: spotifyData.total_episodes
                }
            }
        }))
        const data = podcastData.filter(Boolean);
        response.status(201).send(data)
    } catch (error) {
        next({
            message: 'SEARCH_PODCAST_UPDATE_FAILED',
            originalError: error  
          });
    }
}
