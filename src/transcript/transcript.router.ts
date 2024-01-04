import express from 'express';
import * as transcriptController from './transcript.controller'
const router = express.Router();

router.get('/transcript/getBaiduDiskFileList', transcriptController.getBaiduDiskFileList)

router.get('/transcript/transcribe',transcriptController.transcribe)

export default router;