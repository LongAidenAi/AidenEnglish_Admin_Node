import axios from 'axios';
import { Request, Response, NextFunction } from 'express';
import qiniu from 'qiniu'
import fs from 'fs'
import path from 'path';
import {
  QINIU_ACCESSKEY,
  QINIU_SECRETKEY
} from '../app/app.config'


export const saveImageQiniu = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {

    try {
      // 初始化鉴权信息
      const mac = new qiniu.auth.digest.Mac(
        QINIU_ACCESSKEY, 
        QINIU_SECRETKEY);
            
      // 构建上传策略
      const options = {
        scope: 'aidenenglish',
      };

      const putPolicy = new qiniu.rs.PutPolicy(options);

      // 生成上传 Token
      const uploadToken = putPolicy.uploadToken(mac); 
      
      // 生成随机文件名
      const key = `podcast/18.jpg`;
      // 构建上传参数
      const config = {
          region: qiniu.zone.Zone_as0 // 根据存储区域选择
      };

      const putExtra = new qiniu.form_up.PutExtra();

      // 创建上传对象
      const formUploader = new qiniu.form_up.FormUploader(config);

      // 上传图片
      await formUploader.put(uploadToken, key, request.file.buffer,putExtra, function(respErr, respBody, respInfo) {
        if (!respErr) {
          // 上传成功,处理返回值
          console.log(respBody);
        } else {
          // 上传失败,处理错误
          console.log(respErr);
        }
      });
    } catch (error) {
      console.log(error)
    }
}


export const saveAudioQiniu = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {

    try {
      // 初始化鉴权信息
      const mac = new qiniu.auth.digest.Mac(
        QINIU_ACCESSKEY, 
        QINIU_SECRETKEY);
            
      // 构建上传策略
      const options = {
        scope: 'episode-image',
      };

      const putPolicy = new qiniu.rs.PutPolicy(options);

      // 生成上传 Token
      const uploadToken = putPolicy.uploadToken(mac); 
      
      // 生成随机文件名
      const key = `2.mp3`;
      // 构建上传参数
      const config = {
          region: qiniu.zone.Zone_as0 // 根据存储区域选择
      };

      const putExtra = new qiniu.form_up.PutExtra();

      // 创建上传对象
      const formUploader = new qiniu.form_up.FormUploader(config);

      // 上传图片
      await formUploader.put(uploadToken, key, request.file.buffer, putExtra, function(respErr, respBody, respInfo) {
        if (!respErr) {
          // 上传成功,处理返回值
          console.log(respBody);
        } else {
          // 上传失败,处理错误
          console.log(respErr);
        }
      });
    } catch (error) {
      console.log(error)
    }
    
}

export const getImageQiniu = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
      const mac = new qiniu.auth.digest.Mac(QINIU_ACCESSKEY, QINIU_SECRETKEY);
      const config = new qiniu.conf.Config();
      const bucketManager = new qiniu.rs.BucketManager(mac, config);
      const privateBucketDomain = 'http://cdn.aidenenglish.cn';
      const deadline = Math.floor(Date.now() / 1000) + 3600;
      const privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, '8.jpg', deadline);
      console.log(privateDownloadUrl);
    } catch (error) {
      console.log(error)
    }
}


export const getAudioQiniu = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
  const mac = new qiniu.auth.digest.Mac(QINIU_ACCESSKEY, QINIU_SECRETKEY);
  const config = new qiniu.conf.Config();
  const bucketManager = new qiniu.rs.BucketManager(mac, config);
  const privateBucketDomain = 'http://cdn.aidenenglish.cn';
  const deadline = Math.floor(Date.now() / 1000) + 3600;
  const privateDownloadUrl = bucketManager.privateDownloadUrl(privateBucketDomain, '2.mp3', deadline);
  console.log(privateDownloadUrl);
}