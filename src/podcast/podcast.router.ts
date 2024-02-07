import express from 'express';
import * as podcastController from './podcast.controller';
import { verifyPodcastExists } from './podcast.middleware';

const router = express.Router();

router.post('/podcast/searchNewPodcast', verifyPodcastExists(false), podcastController.searchNewPodcast)

router.post('/podcast/addNewPodcast', podcastController.addNewPodcast)

router.get('/podcast/getAllPodcasts', podcastController.getAllPodcasts)

router.delete('/podcast/deletePodcast', podcastController.deletePodcast)

router.patch('/podcast/updatePodcast', podcastController.updatePodcast)

router.get('/podcast/arrangedesc', podcastController.arrangedesc)

router.get('/podcast/searchPodcastUpdate', podcastController.searchPodcastUpdate)

export default router;