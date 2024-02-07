import dotenv from 'dotenv';

dotenv.config();

/**
 * 应用配置
 */
export const { APP_PORT } = process.env;

/**
 * mysql 数据仓库配置
 */
export const {
    MYSQL_HOST,
    MYSQL_PORT,
    MYSQL_USER,
    MYSQL_PASSWORD,
    MYSQL_DATABASE,
  } = process.env;

/**
 * 跨域资源共享
 */
export const ALLOW_ORIGIN = process.env['ALLOW_ORIGIN']

/**
 * spotify API
 */
export const {
  SPOTIFY_ACCOUNTS_BASE_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_API_BASE_URL,
} = process.env;

/**
 * taddy API
 */
export const {
  TADDY_BASE_URL,
  TADDY_X_USER_ID,
  TADDY_X_API_KEY,
} = process.env;

/**
 * openai API
 */
export const {
  OPENAI_ORGANIZATION_ID,
  OPENAI_API_KEY,
  OPENAI_BASEURL_PROXY
} = process.env;

/**
 * 百度翻译 API
 */
export const {
  BAIDU_TRANS_APPID,
  BAIDU_TRNAS_KEY,
  BAIDU_TRNAS_SALT,
  BAIDU_TRANS_BASE_URL
} = process.env;

/**
 * 百度网盘 API
 */
export const {
  BAIDU_DISK_BASE_URL,
  BAIDU_DISK_UPLOAD_URL,
  BAIDU_DISK_ACCESS_TOKEN,
  BAIDU_DISK_APPID,
  BAIDU_DISK_APPKEY,
  BAIDU_DISK_SECRETKEY,
  BAIDU_DISK_SIGNKEY
} = process.env;

/**
 * deepgram apikey
 */
export const {
  DEEPGRAM_APIKEY
} = process.env

export const {
  QINIU_ACCESSKEY,
  QINIU_SECRETKEY,
  QINIU_SCOPE,
  QINIU_DOMAIN
} = process.env