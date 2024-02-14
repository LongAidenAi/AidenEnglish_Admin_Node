import { connection } from "../app/connect/mysql";

export const updateTranscript = async (transcriptInfo: any) => {
  const statement = `
    UPDATE transcript 
    SET episodeNumber = ?, 
        transcript = ?,
        metaSummary = ?, 
        transSummary = ?,
        paragraphs = ?,
        words = ?
    WHERE podcast_id = ? AND episode_id = ?
  `;

  try {
    await connection.promise().query(statement, [
      transcriptInfo.episodeNumber,
      transcriptInfo.transcript,
      transcriptInfo.metaSummary,
      transcriptInfo.transSummary,
      transcriptInfo.paragraphs,
      transcriptInfo.words,
      transcriptInfo.podcast_id,
      transcriptInfo.episode_id
    ]);

  } catch (error) {
    throw new Error('更新episodes数据库transcript表失败');
  }
};

/***
 * 根据episode_id得到episode
 */
export const getEpisodesInfo = async (
  episodeIdList
) => {
const statement = `
    SELECT 
    e.id,
    e.podcast_id,
    e.episodeNumber,
    p.podcast_name,
    e.name,
    e.transcript_sign,
    e.audio_url
  FROM episode e
  JOIN podcast p ON e.podcast_id = p.id
  WHERE e.id IN (?)
  ORDER BY e.episodeNumber ASC
`;

const [data] = await connection.promise().query(statement,[episodeIdList]);

if (data) {
    return data;
} else {
    throw new Error('获取数据库中播客文字稿是否存在的标识符，失败');
}
}