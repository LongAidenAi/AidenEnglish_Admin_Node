import { Request, Response, NextFunction } from 'express';
import * as podcastService from './podcast.service';

/***
 * 整理searchNewPodcast中获得的数据 
 */
export const arrangeSearchNewPodcastInfo = (
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
      lastest_updatetime_taddy: formatData(item.episodes[0].datePublished),
      description: spotifyData.description,
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

/***
 * 验证podcast是否已经存在
 */
export const VerifyPodcastExists = async (
  request: Request,
  response: Response,
  next: NextFunction
) => {
  const {id_spotify} = request.query
  
  const data = await podcastService.getPodcastById(String(id_spotify))
  
  if(data) next(new Error('PODCAST_IS_ALREADY_EXIST'))

  next()

}