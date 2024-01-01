import { Request, Response, NextFunction } from 'express';
import * as episodeHttps from './episode.https';
import * as episodeService from './episode.service';
import * as podcastService from '../podcast/podcast.service';
import { arrangeSearchEpisodeInfo } from './episode.middleware';

/***
 * 根据id_spotify搜索播客的每集信息
 */
export const searchEpisodes = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {id_spotify,page, limit,allEpisodes,sortOrder} = request.body.data
    try {
        const podcastInfo = await podcastService.getPodcastById(id_spotify)

        const taddyData = await searchTaddyEpisodes(podcastInfo.id_taddy,page,limit,allEpisodes,sortOrder)
        
        const episodesInfo= await arrangeSearchEpisodeInfo(podcastInfo,taddyData,sortOrder)

        response.status(201).send(episodesInfo)
    } catch (error) {
        next({
            message: 'SEARCH_EPISODES_FAILED',
            originalError: error  
          });
    }
}

/***
 * 判断是否需要获取taddy播客的全部集数
 */
export const searchTaddyEpisodes = async (
    id_taddy: string,
    page: number,
    limit: number,
    allEpisodes: boolean,
    sortOrder: string
  ) => {
    let totalEpisodes = [];
    try {
        if(allEpisodes) {
            let pageIndex: number = 1;
            while (true) {
                const taddyMetaData = await episodeHttps.searchTaddyEpisodesById(id_taddy,pageIndex,25,sortOrder)
                const taddyData = taddyMetaData.data.getPodcastSeries.episodes
                totalEpisodes.push(...taddyData)
                if(taddyData.length < 25) {
                    break 
                }
                pageIndex++ 
            }
        } else {
            const taddyMetaData = await episodeHttps.searchTaddyEpisodesById(id_taddy,page,limit,sortOrder)
            const taddyData = taddyMetaData.data.getPodcastSeries.episodes
            totalEpisodes.push(...taddyData)
        }
      
        return totalEpisodes
    } catch (error) {
        throw new Error('从taddy接口获取播客集数失败');
    }
}

/***
 * 保存episodes
 */
export const addEpisodes = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {episodeList} = request.body.data
    
    try {
        const data = await episodeService.saveEpisodes(episodeList)
        response.status(201).send(data)
    } catch (error) {
        
    }
}

/***
 * 删除episodes
 */
export const deleteEpisodes = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {podcast_id_spotify} = request.body.data
    try {
        const data = await episodeService.deletesaveEpisodes(podcast_id_spotify)

        response.status(201).send(data)
    } catch (error) {
        next({
            message: 'DELETE_EPISODES_FAILED',
            originalError: error  
          });
    }
}

