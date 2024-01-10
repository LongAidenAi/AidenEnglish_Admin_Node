import express from 'express';
import * as transcriptController from './transcript.controller'
const router = express.Router();

router.get('/transcript/saveTranscriptInLocal',transcriptController.saveTranscriptInLocal)

router.get('/transcript/fixAudioUrl',transcriptController.fixAudioUrl)

router.get('/transcript/getAllPodcasts',transcriptController.getAllPodcasts)

router.get('/transcript/saveTranscript',transcriptController.saveTranscript)

export default router;