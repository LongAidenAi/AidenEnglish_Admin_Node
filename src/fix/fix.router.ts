import express from 'express';
import * as fixController from './fix.controller';
const router = express.Router();

router.get('/fix/saveTranscriptInLocal', fixController.saveTranscriptInLocal)


export default router;