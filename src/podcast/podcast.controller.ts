import { Request, Response, NextFunction } from 'express';
import * as podcastHttps from './podcast.https';
import * as podcastService from './podcast.service';
import { arrangeSearchNewPodcastInfo, arrangeUpdatePodcastInfo } from './podcast.middleware';

/***
 * 搜索新播客
 */
export const searchNewPodcast = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {headers: {authorization},query: {podcast_name,id_spotify}} = request
    const spotifyToken = authorization.split(' ')[1];
    try {
        const spotifyData = await podcastHttps.searchSpotifyPodcast({spotifyToken,id_spotify})
        
        const taddyData = await podcastHttps.searchTaddyPodcast(String(podcast_name))
        
        const searchPodcastInfo = arrangeSearchNewPodcastInfo(spotifyData,taddyData)

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