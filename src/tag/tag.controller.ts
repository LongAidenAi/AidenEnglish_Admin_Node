import { Request, Response, NextFunction } from 'express';
import * as tagService from './tag.service';
import { convertToArray } from '../transcript/transcript.middleware';

/***
 * 词频分析
 */
export const wordAnalysis = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    try {
        const wordData = await tagService.getWordList()
        const transcriptText = await tagService.getTranscriptText(1)

        const wordDataList = convertToArray(wordData)

        const wordList = wordDataList.map(item => {
            return item.word
        })

        const data = {
            wordList,transcriptText
        }
        response.status(201).send(data)
    } catch (error) {
        next({
            message: 'WORD_ANALYSIS_FAILED',
            originalError: error  
        })
    }
}