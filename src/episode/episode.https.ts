import { Request, Response, NextFunction } from 'express';
import {  apiHttpTaddy } from "../app/connect/axios"
import { apiTransBaidu} from '../app/connect/baiduTrans';
import axios from 'axios';
/**
 * 获取taddy播客每期的信息
 */
export const searchTaddyEpisodesById = async (
    id_taddy:string,
    page: number,
    limit: number,
    sortOrder: string
  ) => {
    const query = `{
      getPodcastSeries(uuid:"${id_taddy}"){
        uuid
        name
        episodes(sortOrder:${sortOrder}, page:${page}, limitPerPage:${limit}){
          uuid
          name
          imageUrl
          audioUrl
          duration
          episodeNumber
          datePublished
          description(
            shouldStripHtmlTags: true
          )
        }
      }
    }` 
  
      try {
      const {data} = await apiHttpTaddy.post('/',{query})
      return data
  
      } catch (error) {
          throw new Error('获取数据失败');
      }
  }
  
/***
 * 调用百度翻译api
 */
export const transDescTool = async (
  description: string
) => {
    try {
      const {data} = await apiTransBaidu(description).post('/translate')
      return data.trans_result[0].dst
    } catch (error) {
      throw new Error('调用百度翻译api失败');
    }
}

