import { connection } from "../app/connect/mysql";

/***
 * 
 */
export const fixTranscript = async (
    transcriptInfo: any
) => {
const updateStatement = `
  UPDATE transcript
  SET 
    transcript = ?,
    paragraphs = ?,
    words = ?
  WHERE episode_id = ? and podcast_id = ?;
`;

for (const item of transcriptInfo) {
  const updateValues = [
    item.transcript,
    item.paragraphs,
    item.words,
    item.episode_id,
    item.podcast_id
  ];

  try {
    await connection.promise().query(updateStatement, updateValues);
    // 更新成功的处理逻辑
  } catch (error) {
    // 错误处理逻辑
    console.log(error)
  }
}
}