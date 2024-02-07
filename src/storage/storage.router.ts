import express from 'express';
import * as storageController from './storage.controller';
const router = express.Router();
import multer from 'multer';

const storage = multer.memoryStorage(); // 使用内存存储，文件不会写入磁盘
const upload = multer({ storage: storage }); // 如果要保存到磁盘，使用 diskStorage

/**
 * 替换播客图片
 */
//保存播客图片至七牛云
router.post('/storage/savePodcastImageQiniu', upload.single('file'), storageController.savePodcastImageQiniu)
//得到七牛云播客图片路径
router.get('/storage/getImageQiniu', storageController.getImageQiniu)

/**
 * 替换episode图片
 */
//用podcast图片进行全部替换
router.get('/storage/usePodcastImageReplaceEpi', storageController.usePodcastImageReplaceEpi)
//用episode图片对每集进行替换，获取到episode图片列表
router.get('/storage/getEpisodeImageList', storageController.getEpisodeImageList)
//保存至七牛云
router.post('/storage/saveEpisodeImageQiniu', upload.single('file'), storageController.saveEpisodeImageQiniu)
//更新数据库图片链接
router.post('/storage/updateEpisodeImage',storageController.updateEpisodeImage)

/**
 * 替换音频
 */
//获取音频列表
router.get('/storage/getEpisodePreAudioList', storageController.getEpisodePreAudioList)
router.get('/storage/getEpisodeAudioList', storageController.getEpisodeAudioList)
//将音频保存至七牛云
router.post('/storage/saveEpisodepreAudioQiniu', upload.single('file'), storageController.saveEpisodepreAudioQiniu)
router.post('/storage/saveEpisodeAudioQiniu', upload.single('file'), storageController.saveEpisodeAudioQiniu)

router.get('/storage/getaudioQiniu', storageController.getaudioQiniu)

//将七牛云链接更新至数据库
router.post('/storage/updateEpisodePreAudio', storageController.updateEpisodePreAudio)
router.post('/storage/updateEpisodeAudio', storageController.updateEpisodeAudio)
export default router;