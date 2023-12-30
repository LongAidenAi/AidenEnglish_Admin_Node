import { apiHTTPSpotify, apiHttpTaddy, apiTokenSpotify } from "../app/connect/axios"

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
      console.log(spotifyToken)
      try {
      const {data} = await apiHTTPSpotify(spotifyToken).get(`/v1/shows/${id_spotify}`)
     
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