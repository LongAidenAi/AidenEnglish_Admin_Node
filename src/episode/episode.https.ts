import { Request, Response, NextFunction } from 'express';
import {  apiHTTPSpotify, apiHttpTaddy } from "../app/connect/axios"
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
        }
      }
    }` 
      try {
      const {data} = await apiHttpTaddy.post('/',{query})
      return data
  
      } catch (error) {
          throw new Error('获取taddy播客每期的信息失败');
      }
  }
  
/***
 * 
 */
export const searchPreviewAudios = async (
  id_spotify: string, token: string, offset: number
) => {
    try {
      const response = await apiHTTPSpotify(token).get(`/v1/shows/${id_spotify}/episodes?limit=50&offset=${offset}`)

      return response.data.items
    } catch (error) {
      throw new Error('获取spotify每期episode的preview音频失败');
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

