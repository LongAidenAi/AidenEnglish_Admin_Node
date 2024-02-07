import { apiHTTPSpotify, apiHttpTaddy, apiTokenSpotify } from "../app/connect/axios"
import openai from '../app/connect/openai';
interface podcastOptions {
    spotifyToken: string,
    id_spotify: any
  }
/***
 * 搜索spotify的播客信息
 */
export const searchSpotifyPodcast = async (
  options: podcastOptions
  ) => {
      const {spotifyToken,id_spotify} = options
      try {
      const {data} = await apiHTTPSpotify(spotifyToken).get(`/v1/shows/${id_spotify}`)
     
      return data

      } catch (error) {
          throw new Error('从spotify接口搜索播客失败');
      }
}

/***
 * 得到spotify的episodes信息，用于更新播客
 */
export const getSpotifyEpisodes = async (
  options: podcastOptions
) => {
    const {spotifyToken,id_spotify} = options
    try {
    const {data} = await apiHTTPSpotify(spotifyToken).get(`/v1/shows/${id_spotify}/episodes`)
    
    return data

    } catch (error) {
        throw new Error('从spotify接口搜索播客失败');
    }    
}

export const test = async (
  spotifyToken: string
  ) => {
      try {
      const {data} = await apiHTTPSpotify(spotifyToken).get(`/v1/shows?ids=7xlVx5F0lSZYqziIssAnYh,4aFKwkboogsBGC6DkQ0H05`)
     
      return data

      } catch (error) {
          throw new Error('从spotify接口搜索播客失败');
      }
}


/***
* 搜索taddy的播客信息
*/
export const searchTaddyPodcast = async (
    podcastName: string
    ) => {
      const query = `
        {
          searchForTerm(term:"${podcastName}", filterForTypes:PODCASTSERIES){
            searchId
            podcastSeries{
              name
              authorName
              imageUrl
              uuid
              itunesId
              totalEpisodesCount
              description
              episodes(sortOrder:LATEST, page:1, limitPerPage:1){
                  uuid
                  name
                  datePublished
                }
            }
          }
        }
      `
        try {
        const {data} = await apiHttpTaddy.post('/',{query})

        return data.data.searchForTerm.podcastSeries
  
        } catch (error) {
            throw new Error('从taddy接口搜索播客失败');
        }
  }

/**
 * 搜索taddy的播客信息，用于更新
 */
export const searchTaddyPodcastInfo = async (
  id_taddy: string
) => {
  const query = `
  {
    getPodcastSeries(uuid:"${id_taddy}"){
        name
        authorName
        imageUrl
        uuid
        itunesId
        totalEpisodesCount
        description
        episodes(sortOrder:LATEST, page:1, limitPerPage:1){
            uuid
            name
            datePublished
          }
      }
  }
`
  try {
  const {data} = await apiHttpTaddy.post('/',{query})

  return data.data.getPodcastSeries.totalEpisodesCount

  } catch (error) {
      throw new Error('从taddy接口搜索播客,获取播客总集数失败');
  }
}


/***
 * 得到taddy的episodes信息，用于更新
 */
export const getTaddyUpdateEpisodes = async (
  id_taddy: string,
  limit: number
) => {
  const query = `
  {
    getPodcastSeries(uuid:"${id_taddy}"){
      uuid
      name
      episodes(sortOrder:LATEST, page:1, limitPerPage:${limit}){
        uuid
        name
        imageUrl
        audioUrl
        duration
        episodeNumber
        datePublished
      }
    }
  }
`
  try {
  const {data} = await apiHttpTaddy.post('/',{query})
  return data.data.getPodcastSeries

  } catch (error) {
      throw new Error('得到taddy的episodes信息,用于更新,失败');
  }
}

/***
* 搜索taddy的播客信息
*/
export const searchTaddyPodcastbyId = async (
  id_taddy: string
  ) => {
    const query = `
      {
        getPodcastSeries(uuid:"${id_taddy}"){
            name
            authorName
            imageUrl
            uuid
            itunesId
            totalEpisodesCount
            description
            episodes(sortOrder:LATEST, page:1, limitPerPage:1){
                uuid
                name
                datePublished
              }
          }
      }
    `
      try {
      const {data} = await apiHttpTaddy.post('/',{query})
      return data.data.getPodcastSeries

      } catch (error) {
          throw new Error('从taddy接口根据id搜索播客失败');
      }
}

/***
 * 通过openai剔除description中的引流链接
 */
export const rejectDescLink = async (
  description: string
) => {
    try {
      const data = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
            {"role": "user", "content": 
              `Please help me remove the links and scripts related to traffic flow in the following text. 
              There should be no website links or email addresses.:${description}`},
            ],
            // temperature: 0.5

        });
        return data.choices[0].message.content

    } catch (error) {
      throw new Error('从openai剔除description中的引流链接失败');
    }
}

/***
 * 通过openai将description翻译为中文
 */
export const transDesc = async (
  dataReject: string
) => {
  
  try {
      const data = await openai.chat.completions.create({
        model: "gpt-3.5-turbo",
        messages: [
          {"role": "system", "content": "Please play the role of an expert in the field of translation, translating English into Chinese."},
          {"role": "user", "content": `Please translate the following text into Chinese:${dataReject}`},
            ],
            temperature: 0 

        });
        return data.choices[0].message.content
  } catch (error) {
    throw new Error('通过openai将description翻译为中文失败');
  }
}