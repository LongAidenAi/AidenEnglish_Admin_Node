import qiniu from 'qiniu'
import {
    uploadToken,
    putExtra,
    formUploader
} from '../app/connect/qiniu'
import {
    QINIU_ACCESSKEY,
    QINIU_SECRETKEY,
    QINIU_DOMAIN
} from '../app/app.config'


export const saveImageQiniu = async (
    filePath: string,
    fileData: any
) => {
    try {
      // 上传图片
      const response = await formUploader.put(uploadToken, filePath, fileData,putExtra, function(respErr, respBody, respInfo) {
        if (!respErr) {
          // 上传成功,处理返回值

          return respBody
        } else {
          // 上传失败,处理错误
          console.log(respErr);
        }
      });

      return response.data
    } catch (error) {
        console.log('storageHttps.saveImageQiniu')
        console.log(error)
    }
}

export const getRecourseQiniu = async (
    resKey: string
) => {
    try {
        const mac = new qiniu.auth.digest.Mac(QINIU_ACCESSKEY, QINIU_SECRETKEY);
        const config = new qiniu.conf.Config();
        const bucketManager = new qiniu.rs.BucketManager(mac, config);
        const publicBucketDomain = QINIU_DOMAIN;
        // 公开空间访问链接
        const publicDownloadUrl = bucketManager.publicDownloadUrl(publicBucketDomain, resKey);
        return publicDownloadUrl
    } catch (error) {
        
    }
}