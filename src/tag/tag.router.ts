import express from 'express';
import * as tagController from './tag.controller';
const router = express.Router();

router.get('/tag/wordAnalysis', tagController.wordAnalysis)

export default router;