import {  apiTokenSpotify } from "../app/connect/axios"

/***
 * 获取spotify TOKEN
 */
export const SpotifyToken = async (
    ) => {
        try {
            const data= await apiTokenSpotify.post('/api/token',null)
            return data
        } catch (error) {
            throw new Error('获取数据失败');
        }
}