import {  apiTokenSpotify } from "../app/connect/axios"

/***
 * 获取spotify TOKEN
 */
export const SpotifyToken = async (
    ) => {
        try {
            console.log(1)
            const data= await apiTokenSpotify.post('/api/token',null)
            console.log(data)
            return data
        } catch (error) {
            console.log(error.message)
            throw new Error('获取数据失败');
        }
}