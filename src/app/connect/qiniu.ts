import qiniu from 'qiniu'
import {
    QINIU_ACCESSKEY,
    QINIU_SECRETKEY,
    QINIU_SCOPE
} from '../app.config'


const mac = new qiniu.auth.digest.Mac(
    QINIU_ACCESSKEY, 
    QINIU_SECRETKEY);
        
  // 构建上传策略
const options = {
  scope: QINIU_SCOPE,
};

const putPolicy = new qiniu.rs.PutPolicy(options);

// 生成上传 Token
export const uploadToken = putPolicy.uploadToken(mac); 

export const putExtra = new qiniu.form_up.PutExtra();

// 构建上传参数
const config = {
    region: qiniu.zone.Zone_as0 // 根据存储区域选择
};
// 创建上传对象
export const formUploader = new qiniu.form_up.FormUploader(config);

