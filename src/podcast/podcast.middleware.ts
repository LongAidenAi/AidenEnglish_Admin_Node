import { Request, Response, NextFunction } from 'express';
import * as podcastService from './podcast.service';
import openai from '../app/connect/openai';
import axios from 'axios';

/***
 * 整理searchNewPodcast中获得的数据 
 */
export const arrangeSearchNewPodcastInfo = async(
  spotifyData:any,taddyData:any
) => {
  const matchedtaddyData = taddyData.filter((item:any) => 
    item.name === spotifyData.name
  );
  
  const arrangedData = matchedtaddyData.map((item:any,index:number) => {
    return {
      podcast_name: spotifyData.name,
      id_spotify: spotifyData.id,
      id_taddy: item.uuid,
      id_itunes: item.itunesId,
      image_spotify: spotifyData.images[0].url,
      image_taddy: item.imageUrl,
      total_episodes_spotify: spotifyData.total_episodes,
      total_episodes_taddy: item.totalEpisodesCount,
      lastest_updatetime_spotify: spotifyData.episodes.items[0].release_date,
      lastest_updatetime_taddy: formatData(item.episodes[0] ? item.episodes[0].datePublished : 0),
      description: spotifyData.description,
      trans_description: ''
    } 
  })
  return arrangedData
}

/***
 * 整理更新的数据
 */
export const arrangeUpdatePodcastInfo = (
  spotifyData:any,taddyData:any
) => {
  return {
    total_episodes_spotify: spotifyData.total_episodes,
    total_episodes_taddy: taddyData.totalEpisodesCount,
    lastest_updatetime_spotify: spotifyData.episodes.items[0].release_date,
    lastest_updatetime_taddy: formatData(taddyData.episodes[0].datePublished),
  }
}

const formatData = (timestamp: any) => {
  // 将时间戳转换成日期
  const date = new Date(timestamp * 1000); 
  //获取日期部分
  const formattedDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +  date.getDate();
  return formattedDate
}


// 包装函数，用于生成 VerifyPodcastExists 中间件
export const verifyPodcastExists = (shouldExist:boolean) => {
  return (
    request: Request,
    response: Response,
    next: NextFunction,
  ) => {
    VerifyPodcastExistsWrapper(request, response, next, shouldExist);
  };
};
/***
 * 验证podcast是否已经存在
 */
const VerifyPodcastExistsWrapper = async (
  request: Request,
  response: Response,
  next: NextFunction,
  shouldExist: boolean
) => {
  const {id_spotify} = request.body.data

  const data = await podcastService.getPodcastByIdSpotify(id_spotify)
  if (data) {
    shouldExist ? next() : next(new Error('PODCAST_IS_ALREADY_EXIST'));
  } else {
    shouldExist ? next(new Error('PODCAST_DOES_NOT_EXIST')) : next();
  }

}


//过滤引流链接和特定字眼的方法
export const filterDescTool = (description:string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g; // 匹配链接的正则表达式

  // 过滤链接
  let filteredDesc = description.replace(urlRegex, '');
  // 过滤特定字眼

  return filteredDesc;
}
