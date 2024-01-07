import { Request, Response, NextFunction } from 'express';
import * as testHttps from './test.https';
import * as podcastHttps from '../podcast/podcast.https';
/***
 * 
 */
export const deepgram = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {episodeAudioUrl} = request.query
    try {
        const data = await testHttps.deepgramAPI(String(episodeAudioUrl))
        response.status(201).send(data)
    } catch (error) {
    }
}


export const searchSpotifyPodcast = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {

    const {headers: {authorization},body:{data: {spotifyPodcastUrl}}} = request
    const spotifyToken = authorization.split(' ')[1];

    const regex = /\/show\/([a-zA-Z0-9]+)\?/;
    const match = spotifyPodcastUrl.match(regex);
    if (match && match[1]) {
      const data = match[1];
      const id_spotify = data

      try {
        const spotifyData = await podcastHttps.searchSpotifyPodcast({spotifyToken,id_spotify}) 
        response.status(201).send(spotifyData)

      } catch (error) {
        console.log(error.message)
      }

    } else {
      console.log("无效路径");
    }

}