import { Request, Response, NextFunction } from 'express';
import * as pdfService from './pdf.https'
import { arrangeTransToPDF_v2, arrangeTranscriptInfo } from './pdf.middleware';
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
    const filePath = `${Path.localPath}/${titlePDF}_b站分享版.pdf`
    const filePath_v2 = `${Path.localPath}/${titlePDF}_无官网链接版.pdf`

    try {
        const DeepGramData = await pdfService.apiDeepGramTranscribe(convertedPath)
        const transcriptInfo = await arrangeTranscriptInfo(DeepGramData)
        arrangeTransToPDF(transcriptInfo, filePath, String(titlePDF)); 
        arrangeTransToPDF_v2(transcriptInfo, filePath_v2, String(titlePDF)); 
        response.status(201).send()
    } catch (error) {
        console.log(error)
    }
}