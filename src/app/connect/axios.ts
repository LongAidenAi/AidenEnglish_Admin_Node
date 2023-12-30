import axios from 'axios'
import { 
    SPOTIFY_ACCOUNTS_BASE_URL,
    SPOTIFY_CLIENT_ID,
    SPOTIFY_CLIENT_SECRET,
    TADDY_BASE_URL,
    TADDY_X_USER_ID,
    TADDY_X_API_KEY,
    SPOTIFY_API_BASE_URL
 } from '../../app/app.config';

export const apiHTTPSpotify = (token:string) => {
    const connnect = axios.create({
        baseURL: SPOTIFY_API_BASE_URL,
        headers: {
            'Authorization': `Bearer ${token}`,
        }
    })
    return connnect
}

export const apiHttpTaddy = axios.create({
    baseURL: TADDY_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
        'X-USER-ID': TADDY_X_USER_ID,
        'X-API-KEY': TADDY_X_API_KEY,
    }
});

export const apiTokenSpotify = axios.create({
    baseURL: SPOTIFY_ACCOUNTS_BASE_URL,
    headers: {'Content-Type': 'application/x-www-form-urlencoded'},
    params: {
        'grant_type': 'client_credentials',
        'client_id': SPOTIFY_CLIENT_ID,
        'client_secret': SPOTIFY_CLIENT_SECRET
      }
})

