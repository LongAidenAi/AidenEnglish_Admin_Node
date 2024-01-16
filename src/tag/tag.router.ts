import express from 'express';
import * as tagController from './tag.controller';
const router = express.Router();

router.get('/tag/getTagList', tagController.getTagList)

router.get('/tag/savePodcastTag', tagController.savePodcastTag)

export default router;