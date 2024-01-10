import { connection } from "../app/connect/mysql";

/***
 * 
 */
export const saveTranscript = async (transriptList: any[]) => {
    const statement = `
      INSERT INTO transcript 
      (episode_id, transcript, metaSummary, transSummary, paragraphs, words) 
      VALUES ?;
    `;
  
    const values = transriptList.map(item => [
        item.episode_id,
        item.transcript,
        item.metaSummary,
        item.transSummary,
        item.paragraphs,
        item.words,
    ]);
  
    const [data] = await connection.promise().query(statement, [values]);
    if (data) {
      return data;
    } else {
      throw new Error('将episodes保存到数据库中失败');
    }
  };