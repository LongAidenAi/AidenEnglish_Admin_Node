import { Request, Response, NextFunction } from 'express';
import * as podcastHttps from './podcast.https';
import * as podcastService from './podcast.service';
import { arrangeSearchNewPodcastInfo, arrangeUpdatePodcastInfo,filterDescTool } from './podcast.middleware';
import * as episodeHttps from '../episode/episode.https';


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
    const {headers: {authorization},body: {data: {id_spotify,id_taddy}}} = request
    const spotifyToken = authorization.split(' ')[1];

    try {
        const spotifyData = await podcastHttps.searchSpotifyPodcast({spotifyToken,id_spotify})
        
        const taddyData = await podcastHttps.searchTaddyPodcastbyId(String(id_taddy))

        const updatePodcastInfo = arrangeUpdatePodcastInfo(spotifyData,taddyData)

        const data = await podcastService.upatePodcast(updatePodcastInfo,id_taddy)
        
        response.status(201).send(data)
    } catch (error) {
        next({
            message: 'UPDATE_PODCAST_FAILED',
            originalError: error  
          });
    }

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
            const dataReject = filterDescTool(String(description))

             //百度api
            const dataTrans = await episodeHttps.transDescTool(String(dataReject))

            response.status(201).send({dataReject,dataTrans})
        } else {
            //剔除引流链接
            const dataReject = await podcastHttps.rejectDescLink(String(description))

            //翻译成中文 openai api
            // const dataTrans = await podcastHttps.transDesc(String(dataReject))

            //百度api
            const dataTrans = await episodeHttps.transDescTool(String(dataReject))

            response.status(201).send({dataReject,dataTrans})
        }
    } catch (error) {
        next(new Error('ARRANGE_PODCAST_DESCRIPTION_FAILED'));
    }
}