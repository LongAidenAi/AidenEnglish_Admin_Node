import express from 'express';
import * as podcastController from './podcast.controller';
import { VerifyPodcastExists } from './podcast.middleware';

const router = express.Router();

router.get('/podcast/searchNewPodcast', VerifyPodcastExists, podcastController.searchNewPodcast)

router.post('/podcast/addNewPodcast', podcastController.addNewPodcast)

router.get('/podcast/getAllPodcasts', podcastController.getAllPodcasts)

router.delete('/podcast/deletePodcast', podcastController.deletePodcast)

router.patch('/podcast/updatePodcast', podcastController.updatePodcast)
export default router;