import { deepgram } from '../app/connect/deepgram';
import fs from 'fs'

export const apiDeepGramTranscribe = async (
    audioPath: string
) => {
    try {
        const { result, error } = await deepgram.listen.prerecorded.transcribeFile(
            fs.readFileSync(audioPath),
            {
                model: "nova-2",
                smart_format: true,
                language: "en",
                summarize: 'v2'
            }
          );

        if (error) {
            console.log(error.message)
            throw new Error('调用deepgram的api转换音频到文本失败');
        }

        return result

    } catch (error) {
        throw new Error(error.message);
    }
}