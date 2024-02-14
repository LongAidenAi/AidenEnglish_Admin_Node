import express from 'express';
import * as pdfController from './pdf.controller'
const router = express.Router();

router.get('/pdf/audioToPdf', pdfController.audioToPdf)


export default router;