import express from 'express';
import * as fixController from './fix.controller';
const router = express.Router();

router.get('/fix/saveTranscriptInLocal', fixController.saveTranscriptInLocal)

router.get('/fix/uploadTranscript',fixController.uploadTranscript)

router.get('/fix/saveTranscriptInLocal_2', fixController.saveTranscriptInLocal_2)

router.get('/fix/uploadTranscript_2',fixController.uploadTranscript_2)

export default router;