import { connection } from "../app/connect/mysql";

/***
 * 获取词汇列表
 */
export const getWordList = async (

) => {
    const statement = `
    select word 
    from junior
    LIMIT 100;
    `

    try {
        const [data] = await connection.promise().query(statement);
        return data
      } catch (error) {
        throw new Error('获取词语列表失败');
      }
}

/***
 * 获取文字稿文本
 */
export const getTranscriptText = async (
    episodeNumber: number
) => {
    const statement = `
    select transcript
    from transcript
    where episodeNumber = ?
    `

    try {
        const [data] = await connection.promise().query(statement,episodeNumber);
        return data[0].transcript
      } catch (error) {
        throw new Error('获取文字稿文本失败');
      }
}