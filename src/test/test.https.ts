import axios from 'axios';
import { deepgram } from '../app/connect/deepgram';
import fs from 'fs'
import { apiHTTPSpotify } from 'src/app/connect/axios';

export const deepgramAPI = async (
  episodeAudioUrl: string
) => {
    try {
        const { result, error } = await deepgram.listen.prerecorded.transcribeUrl(
            {
              url: episodeAudioUrl,
            },
            {
              smart_format: true,
              model: "nova-2",
              summarize: 'v2'
            }
          );
        if (error) {
            console.log(error.message)
            // throw new Error('调用deepgram的api转换音频到文本失败');
        }
        if(result) {
            return result
        }

    } catch (error) {
        console.log(error.message)
        // throw new Error(error.message);
    }
}


/***
 * 
 */
