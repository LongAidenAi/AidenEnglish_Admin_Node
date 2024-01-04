import { connection } from "../app/connect/mysql";

/***
 * 根据id_spotify得到episode
 */
export const getEpisodesInfo = async (
    id_spotify: string
) => {
    const statement = `
         select 
         id,
         podcast_id,
         episodeNumber,
         podcast_name,
         name,
         transcript_sign,
         audioUrl
        from episodes
        where podcast_id_spotify = ?;
        `
    // const statement = `
    //     select 
    //      id,
    //      podcast_id,
    //      episodeNumber,
    //      podcast_name,
    //      name,
    //      transcript_sign,
    //      audioUrl
    //     from episodes
    //     where id IN (22);
    // `
        const [data] = await connection.promise().query(statement,id_spotify);

        if (data) {
            return data
         } else {
            throw new Error('获取数据库中播客文字稿是否存在的标识符，失败');
         }   
}

/***
 * 
 */
export const saveEpisodesTranscriptInfo = async (
    episodes_transcriptInfoList: any[]
) => {

  const values = episodes_transcriptInfoList.map((item) => [
    item.episode_id,
    item.fsids,
    item.path
  ]);

  const statement = `
    INSERT INTO episodes_transcript 
    (episode_id, fsids, path)
    VALUES ?;
  `;

  try {
    const [data] = await connection.promise().query(statement, [values]);
    // 返回插入结果或进行其他后续操作
    console.log('将文字稿插入数据库成功')
    return data
  } catch (error) {
    console.error('将文字稿相关信息插入数据库失败:', error.message);
    throw new Error(`将文字稿相关信息插入数据库失败${error.message}`);
  }
};