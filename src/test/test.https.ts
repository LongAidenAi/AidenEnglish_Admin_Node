import axios from 'axios';
import { deepgram } from '../app/connect/deepgram';
import fs from 'fs'
import {  apiHTTPSpotify} from "../app/connect/axios"

export const deepgramAPI = async (
  episodeAudioUrl: string
) => {
    try {
        const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
            {
              url: episodeAudioUrl,
            },
            {
              model: "nova-2",
              smart_format: true,
              language: "en",
              summarize: 'v2'
            }
          );
        if (error) {
            console.log(error.message)
            throw new Error('调用deepgram的api转换音频到文本失败');
        }
        if(result) {
            return result
        }

    } catch (error) {
        console.log(error.message)
        throw new Error(error.message);
    }
}


/***
 * 
 */
export const previewAudio = async (
  id_spotify: string, token: string, offset: number
) => {
    try {
      const response = await apiHTTPSpotify(token).get(`/v1/shows/${id_spotify}/episodes?limit=50&offset=${offset}`)

      return response.data.items
    } catch (error) {
      console.log('testHttps.previewAudio:' + error)
    }
}
