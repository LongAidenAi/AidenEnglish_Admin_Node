import { Request, Response, NextFunction } from 'express';
import * as episodeHttps from '../episode/episode.https';
import * as episodeService from './episode.service';
import crypto from 'crypto'
import axios from 'axios';

/***
 * 整理addEpisode中获得的数据    
 */
export const arrangeSearchEpisodeInfo = async (
  podcastInfo:any, taddyData:any, sortOrder: string,PreviewAudiosList: any
) => {
    const arrangedData = await Promise.all(
      taddyData.map(async (item: any,index: number) => {
          // await new Promise<void>(resolve => {
          //   let i = index
          //   setTimeout(() => {
          //     resolve(); 
          //   }, i * 110);
          // });
          const regex = new RegExp('^' + podcastInfo.podcast_name);
  
          const matched = item.name.match(regex);
        
          if(matched) {
            // 匹配到podcast name部分
            item.name = item.name.replace(regex, ''); 
          }
        
          if(!item.imageUrl) item.imageUrl = podcastInfo.image_url
         
          const updatetime = formatData(item.datePublished)
          const duration = formatDuration(item.duration)
        
          if(sortOrder == 'OLDEST') {
            if(!item.episodeNumber || index+1 !== item.episodeNumber) {
              item.episodeNumber = index+1;
            }
          } else if(sortOrder == 'LATEST') {
            if(!item.episodeNumber || taddyData.length - index !== item.episodeNumber) {
              item.episodeNumber = taddyData.length - index; 
            }
          }
          

          // const transDesc = await episodeHttps.transDescTool(filterDesc)
          console.log(index)
          return {
            podcast_id: podcastInfo.id,
            podcast_name: podcastInfo.podcast_name,
            podcast_id_spotify: podcastInfo.id_spotify,
            podcast_id_taddy: podcastInfo.id_taddy,
            podcast_image_url: podcastInfo.image_url,
            podcast_lastest_updatetime: podcastInfo.lastest_updatetime_taddy,
            podcast_total_episodes: podcastInfo.total_episodes_taddy,
            name: item.name,
            id_taddy: item.uuid,
            image: item.imageUrl,
            audio_url: item.audioUrl,
            audio_preview_url: PreviewAudiosList[index].audio_preview_url,
            update_time: updatetime,
            duration: duration,
            episodeNumber: item.episodeNumber,
            transcript_sign: 0,
            preview_update_item: PreviewAudiosList[index].update_item
          }
    }))
    console.log(`已完成,共${taddyData.length}集`)
  return arrangedData
}

/***
 * 
 */
export const arrangeUpdateEpisodesInfo = (
  updateInfo: any, updateNumbers: number,previewAudioList: any,taddyData: any
) => {
  let arr = []
  let data = {}
  for (let index = 0; index < updateNumbers; index++) {

    let episodeNumber = taddyData.episodes[index].episodeNumber;
    if(!episodeNumber) {
      episodeNumber = updateInfo.total_episodes_database + index;
    }

    let image = taddyData.episodes[index].imageUrl
    if(!image) image = updateInfo.image_url

    const updatetime = formatData(taddyData.episodes[index].datePublished)
    const duration = formatDuration(taddyData.episodes[0].duration)

     data = {
      name: taddyData.episodes[index].name,
      id_taddy: taddyData.episodes[index].uuid,
      image,
      audio_url: taddyData.episodes[index].audioUrl,
      audio_preview_url: previewAudioList[index].audio_preview_url,
      update_time: updatetime,   
      episodeNumber,
      transcript_sign: 0,
      duration: duration,
      podcast_id: updateInfo.podcast_id,
      isFreeSample: 0,
     }

     arr.push(data)
  }

  return arr
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

const formatDuration = (duration: any) => {
  const minutes = Math.floor(duration / 60);
  const remainingSeconds = duration % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}
