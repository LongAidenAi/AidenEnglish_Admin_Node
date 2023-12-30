import dotenv from 'dotenv';

dotenv.config();

/**
 * 应用配置
 */
export const { APP_PORT } = process.env;

/**
 * 数据仓库配置
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
 * 第三方api服务
 */
export const {
  SPOTIFY_ACCOUNTS_BASE_URL,
  SPOTIFY_CLIENT_ID,
  SPOTIFY_CLIENT_SECRET,
  SPOTIFY_API_BASE_URL,
  TADDY_BASE_URL,
  TADDY_X_USER_ID,
  TADDY_X_API_KEY
} = process.env;

