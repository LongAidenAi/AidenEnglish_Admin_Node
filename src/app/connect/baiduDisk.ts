import axios from 'axios'
import {
    BAIDU_DISK_BASE_URL,
    BAIDU_DISK_ACCESS_TOKEN,
    BAIDU_DISK_APPKEY,
    BAIDU_DISK_SECRETKEY,
    BAIDU_DISK_SIGNKEY,
    BAIDU_DISK_UPLOAD_URL
} from '../app.config'


const params = {
    response_type: 'code',
    client_id: BAIDU_DISK_APPKEY, 
    redirect_uri: 'http://localhost:3001',
    scope: 'basic,netdisk',
}

export const apiDiskBaidu = axios.create({
    baseURL: BAIDU_DISK_BASE_URL,
    params: {
        access_token: BAIDU_DISK_ACCESS_TOKEN
    }
})

export const apiDiskBaiduUpload = axios.create({
    baseURL: BAIDU_DISK_UPLOAD_URL,
    params: {
        method: 'upload',
        access_token: BAIDU_DISK_ACCESS_TOKEN
    },
    headers: {
      'Content-Type': 'multipart/form-data'
    }
})

