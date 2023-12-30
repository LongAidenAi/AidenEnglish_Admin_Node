import app from './app/index'
import {APP_PORT,MYSQL_PORT} from './app/app.config'
import { connection } from './app/connect/mysql';

app.listen(APP_PORT, () => {
  console.log(`服务启动成功，端口号为:${APP_PORT}`)
})

/**
 * 测试使用数据服务连接
 */
connection.connect(error => {
  if (error) {
    console.log('连接数据服务失败：', error.message);
    return;
  }

  console.log(`成功连接数据服务，端口号${MYSQL_PORT}`);
});