import { Request, Response, NextFunction } from 'express';
import * as tagService from './tag.service';
import { convertToArray } from '../transcript/transcript.middleware';
import { arrangeMetaTagList } from './tag.middleware';
import * as podcastService from '../podcast/podcast.service'
/***
 * 获取标签列表
 */
export const getTagList = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const data = await tagService.getTagList()
        const metaTagList = convertToArray(data)

        const tagList = arrangeMetaTagList(metaTagList)

        response.status(201).send(tagList)
        
    } catch (error) {
        next({
            message: 'GET_TAG_LIST_FAILED',
            originalError: error.message  
        });
    }
}

/***
 * 保存pdocast的标签
 */
export const savePodcastTag = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {
        podcast_id,
        totalScore,
        podcast_level,
        tagIdList
    } = request.query
    const podcastTagIdList = convertToArray(tagIdList)

    podcastTagIdList.map((item: any) =>  Number(item))
    try {
        const podcast = await podcastService.getPodcastById(Number(podcast_id))
        if(!podcast) return next(new Error('PODCAST_IS_NOT_EXIST'));

        const PodcastTag = await tagService.getPodcastTagInfoById(Number(podcast_id)) 
        if(PodcastTag)  return next(new Error('PODCAST_TAG_IS_EXIST'));
        
        await tagService.savePodcastTag(podcastTagIdList,Number(podcast_id))
        await tagService.savePodcastLevel(Number(podcast_id),Number(totalScore),String(podcast_level))
        response.status(201).send()
    } catch (error) {
        next({
            message: 'SAVE_PODCAST_TAG_FAILED',
            originalError: error.message  
        });
    }
}