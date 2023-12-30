import { Request, Response, NextFunction } from 'express';
import { apiHTTPSpotify } from '../app/connect/axios';
import * as appHttps from './app.https';


/***
 * 获取Spotify TOKEN
 */
export const getSpotifyToken = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const data = await appHttps.SpotifyToken()

        const result = {
            token: data.access_token,  
            create_time: String(Date.now())
        };

        response.status(201).send(result)

    } catch (error) {
        next(new Error('GET_SPOTIFY_TOKEN_FAILED'));
    }
}