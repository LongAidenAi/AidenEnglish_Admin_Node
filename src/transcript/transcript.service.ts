import { connection } from "../app/connect/mysql";


/***
 * 通过每个episode的episodenumber和podcast_id获取episode的id
 */
export const getMissingFilesId = async (
  podcast_id: number,missingFiles: any,
) => {
  const statement = `
  SELECT 
    id
  FROM episodes
  WHERE podcast_id = ? and episodeNumber IN (?);
  `;

  console.log(podcast_id,missingFiles)
  try {
    const [data] = await connection.promise().query(statement,[podcast_id, missingFiles]);
    // 返回插入结果或进行其他后续操作
    return data
  } catch (error) {
    console.error('获取episode的id失败:', error.message);
    throw new Error(`获取episode的id失败：${error.message}`);
  }
}

/***
 * 根据id_spotify得到episode
 */
export const getEpisodesInfo = async (
    id_spotify: string,addAgain: any
) => {
  const statement = `
    SELECT 
      id,
      podcast_id,
      episodeNumber,
      podcast_name,
      name,
      transcript_sign,
      audioUrl
    FROM episodes
    WHERE ${addAgain ? 'id IN (?)' : 'podcast_id_spotify = ?'};
  `;
  const params = addAgain ? [addAgain] : id_spotify;
  const [data] = await connection.promise().query(statement,params);

  if (data) {
      return data;
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

/***
 * 替换为新的audioUrl
 */
export const replaceAudioUrl = async (
  episodesInfoList:any
) => {
  try {
    for (const item of episodesInfoList) {
      const statement = `
        UPDATE episodes
        SET audioUrl = ?
        WHERE id = ?;
      `;
      await connection.promise().query(statement, [item.audioUrl, item.id]);
    }
  } catch (error) {
    throw new Error('更新数据库中每期播客的音频地址失败');
  }
}

/***
 * 
 */
export const getEpisodesAudioUrlInfo = async (
  id_spotify:string
) => {
   const statement = `
    select 
    id,
    audioUrl
   from episodes
   where podcast_id_spotify = ?;
   `
   const [data] = await connection.promise().query(statement,id_spotify);

   if (data) {
       return data
    } else {
       throw new Error('获取数据库中每期音频文件地址失败');
    }   
}