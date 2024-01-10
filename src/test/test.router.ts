import express from 'express';
import * as testController from './test.controller';
const router = express.Router();

router.get('/test/deepgram',testController.deepgram)

router.post('/test/searchSpotifyPodcast',testController.searchSpotifyPodcast)

router.get('/test/saveTranscript',testController.saveTranscript)

export default router;