import axios from 'axios'
import crypto from 'crypto'
import { 
    BAIDU_TRANS_APPID,
    BAIDU_TRNAS_KEY,
    BAIDU_TRNAS_SALT,
    BAIDU_TRANS_BASE_URL
 } from '../../app/app.config';


export const apiTransBaidu = (description:string) => {
  const appid = BAIDU_TRANS_APPID;
  const query = description;
  const from = 'en';
  const to = 'zh';
  const salt = BAIDU_TRNAS_SALT;
  const key = BAIDU_TRNAS_KEY;
  
  // 拼接字符串1
  const str1 = appid + query + salt + key;
  
  // 计算MD5签名
  const sign = crypto.createHash('md5').update(str1).digest('hex');
  
  // 构建请求参数对象
  const params = new URLSearchParams();
  params.append('q', query);
  params.append('from', from);
  params.append('to', to);
  params.append('appid', appid);
  params.append('salt', salt);
  params.append('sign', sign);

  const connnect = axios.create({
    baseURL: BAIDU_TRANS_BASE_URL,
    params
  });
  
  return connnect
}

