import { Request, Response, NextFunction } from 'express';
import * as episodeHttps from '../episode/episode.https';
import * as episodeService from './episode.service';
import crypto from 'crypto'
import axios from 'axios';

/***
 * 整理addEpisode中获得的数据    
 */
// export const arrangeSearchEpisodeInfo = async (
//     podcastInfo:any, taddyData:any, sortOrder: string   
//   ) => {
    
//     const arrangedData = await Promise.allSettled(taddyData.map(async (item: any,index: number) => {
      
//     const regex = new RegExp('^' + podcastInfo.podcast_name);
  
//     const matched = item.name.match(regex);
  
//     if(matched) {
//       // 匹配到podcast name部分
//       item.name = item.name.replace(regex, ''); 
//     }
  
//     if(!item.imageUrl) item.imageUrl = podcastInfo.image
//     const updatetime = formatData(item.datePublished)
//     const duration = formatDuration(item.duration)
  
//     if(sortOrder == 'OLDEST') {
//       if(!item.episodeNumber || index+1 !== item.episodeNumber) {
//         item.episodeNumber = index+1;
//       }
//     } else if(sortOrder == 'LATEST') {
//       if(!item.episodeNumber || taddyData.length - index !== item.episodeNumber) {
//         item.episodeNumber = taddyData.length - index; 
//       }
//     }

//     const filterDesc = filterDescTool(item.description);

//     const transDesc = await episodeHttps.transDescTool(filterDesc)
//       return {
//         podcast_id: podcastInfo.id,
//         podcast_name: podcastInfo.podcast_name,
//         podcast_id_spotify: podcastInfo.id_spotify,
//         podcast_id_taddy: podcastInfo.id_taddy,
//         podcast_image_spotify: podcastInfo.image_spotify,
//         name: item.name,
//         id_taddy: item.uuid,
//         image: item.imageUrl,
//         audioUrl: item.audioUrl,
//         description: filterDesc,
//         update_time: updatetime,
//         duration: duration,
//         episodeNumber: item.episodeNumber,
//         trans_description: transDesc,
//         transcript_url: ''
//       }
      
//     }));
//     return arrangedData
//   }

export const arrangeSearchEpisodeInfo = async (
  podcastInfo:any, taddyData:any, sortOrder: string   
) => {
    const arrangedData = await Promise.all(
      taddyData.map(async (item: any,index: number) => {
          await new Promise<void>(resolve => {
            let i = index
            setTimeout(() => {
              resolve(); 
            }, i * 110);
          });
          const regex = new RegExp('^' + podcastInfo.podcast_name);
  
          const matched = item.name.match(regex);
        
          if(matched) {
            // 匹配到podcast name部分
            item.name = item.name.replace(regex, ''); 
          }
        
          if(!item.imageUrl) item.imageUrl = podcastInfo.image
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
          
          const filterDesc = filterDescTool(item.description);
  
          const transDesc = await episodeHttps.transDescTool(filterDesc)
          console.log(index)
          return {
            podcast_id: podcastInfo.id,
            podcast_name: podcastInfo.podcast_name,
            podcast_id_spotify: podcastInfo.id_spotify,
            podcast_id_taddy: podcastInfo.id_taddy,
            podcast_image_spotify: podcastInfo.image_spotify,
            name: item.name,
            id_taddy: item.uuid,
            image: item.imageUrl,
            audioUrl: item.audioUrl,
            description: filterDesc,
            update_time: updatetime,
            duration: duration,
            episodeNumber: item.episodeNumber,
            trans_description: transDesc,
            transcript_url: ''
          }
    }))
  return arrangedData
}


const formatData = (timestamp: any) => {
  // 将时间戳转换成日期
  const date = new Date(timestamp * 1000); 
  //获取日期部分
  const formattedDate = date.getFullYear() + "-" + (date.getMonth() + 1) + "-" +  date.getDate();
  return formattedDate
}
const formatDuration = (duration: any) => {
  const minutes = Math.floor(duration / 60);
  const remainingSeconds = duration % 60;

  const formattedMinutes = String(minutes).padStart(2, '0');
  const formattedSeconds = String(remainingSeconds).padStart(2, '0');

  return `${formattedMinutes}:${formattedSeconds}`;
}

// 过滤引流链接和特定字眼的方法
const filterDescTool = (description:string) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g; // 匹配链接的正则表达式

  // 过滤链接
  let filteredDesc = description.replace(urlRegex, '');

  // 剔除特定链接 anything goes with emma chamberlain
  const specificURL = 'Visit podcastchoices.com/adchoices'; 
  filteredDesc = filteredDesc.replace(specificURL, '');

  return filteredDesc;
}
