import express from 'express';
import * as episodeController from './episode.controller';
import { verifyPodcastExists } from '../podcast/podcast.middleware';
const router = express.Router();

router.post('/episode/searchEpisodes', verifyPodcastExists(true),episodeController.searchEpisodes)

router.post('/episode/addEpisodes', episodeController.addEpisodes)

router.post('/episode/deleteEpisodes', episodeController.deleteEpisodes)

export default router;