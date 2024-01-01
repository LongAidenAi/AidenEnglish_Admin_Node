import axios from 'axios'
import {
    BAIDU_DISK_BASE_URL,
    BAIDU_DISK_APPID,
    BAIDU_DISK_APPKEY,
    BAIDU_DISK_SECRETKEY,
    BAIDU_DISK_SIGNKEY
} from '../app.config'


const params = {
    response_type: 'code',
    client_id: BAIDU_DISK_APPKEY, 
    redirect_uri: 'http://localhost:3001',
    scope: 'basic,netdisk',
}

export const apiDiskBaidu = axios.create({
    baseURL: BAIDU_DISK_BASE_URL,
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    params
})

