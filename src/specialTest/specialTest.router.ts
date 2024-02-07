import express from 'express';
import * as specialTestController from './specialTest.controller';
const router = express.Router();
import multer from 'multer';

const storage = multer.memoryStorage(); // 使用内存存储，文件不会写入磁盘
const upload = multer({ storage: storage }); // 如果要保存到磁盘，使用 diskStorage

router.post('/specialTest/saveImageQiniu', upload.single('file'), specialTestController.saveImageQiniu)

router.post('/specialTest/saveAudioQiniu', upload.single('file'), specialTestController.saveAudioQiniu)

router.get('/specialTest/getImageQiniu', specialTestController.getImageQiniu)

router.get('/specialTest/getAudioQiniu', specialTestController.getAudioQiniu)

export default router;