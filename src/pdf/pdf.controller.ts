import { Request, Response, NextFunction } from 'express';
import * as pdfService from './pdf.https'
import { arrangeTranscriptInfo } from './pdf.middleware';
import { arrangeTransToPDF } from './pdf.middleware';

enum Path {
    localPath = 'F:/Work_Resources/Podcast_Project/Graded_Podcasts',
}
export const audioToPdf = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {audioPath, titlePDF} = request.query

    let convertedPath = String(audioPath).replace(/\\/g, '/');
    const filePath = `${Path.localPath}/${titlePDF}.pdf`

    try {
        const DeepGramData = await pdfService.apiDeepGramTranscribe(convertedPath)
        const transcriptInfo = await arrangeTranscriptInfo(DeepGramData)
        arrangeTransToPDF(transcriptInfo, filePath, String(titlePDF)); 
        response.status(201).send()
    } catch (error) {
        console.log(error)
    }
}