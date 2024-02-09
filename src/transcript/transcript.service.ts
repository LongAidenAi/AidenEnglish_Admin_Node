import { connection } from "../app/connect/mysql";


/***
 * 
 */
export const getAllPocastsShortInfo = async (
) => {
  const statement = `
  SELECT 
    id,
    podcast_name,
    total_episodes_taddy,
    image_url,
    lastest_updatetime_taddy
  from podcast
 `
 try {
  const [data] = await connection.promise().query(statement);
  // 返回插入结果或进行其他后续操作
  return data
} catch (error) {
  console.error('获取所有播客简短信息失败:', error.message);
  throw new Error(`获取所有播客简短信息失败:${error.message}`);
}
}

/***
 * 通过每个episode的episodenumber和podcast_id获取episode的id
 */
export const getMissingFilesId = async (
  podcast_id: number,missingFiles: any,
) => {
  const statement = `
  SELECT 
    id
  FROM episode
  WHERE podcast_id = ? and episodeNumber IN (?);
  `;

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
    podcast_id: number,addAgain: any
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
    WHERE ${addAgain ? 'e.id IN (?)' : 'e.podcast_id = ?'}
    ORDER BY e.episodeNumber ASC
  `;
  const params = addAgain ? [addAgain] : podcast_id;
  const [data] = await connection.promise().query(statement,params);

  if (data) {
      return data;
  } else {
      throw new Error('获取数据库中播客文字稿是否存在的标识符，失败');
  }
}


export const changeTranscriptSigns = async (
  podcast_id: number,
  episode_id: number,
  signs: number,
  episodeNumber: number
) => {
  const statement = `
    UPDATE episode
    SET transcript_sign = ?
    WHERE podcast_id = ? and id = ?;
  `

  try {
    await connection.promise().query(statement, [signs, podcast_id,episode_id]);
    console.log(`播客${podcast_id}, 第${episodeNumber}集，文字稿存入数据库成功`)
  } catch (error) {
    console.error('修改数据库中文字稿是否存在的状态，失败：:', error.message);
    throw new Error(`修改数据库中文字稿是否存在的状态，失败：:${error.message}`);
  }
  
}


export const getTranscriptInfo = async (
  podcast_id: number
) => {
  const statement = `
  SELECT 
  	id,
  	episodeNumber,
  	transcript_sign,
    audio_url
  from episode
  where podcast_id = ? and episodeNumber = 1;
  `
  try {
    const [data] = await connection.promise().query(statement, podcast_id);
    
    return data[0]

  } catch (error) {
    console.error('fail, 获取文字稿是否获取的状态失败:', error.message);
    throw new Error(`fail, 获取文字稿是否获取的状态失败${error.message}`);
  }
}

/***
 * 替换为新的audioUrl
 */
export const replaceAudioUrl = async (
  episodesInfoList:any
) => {
  try {
    for (const item of episodesInfoList) {
      const statement = `
        UPDATE episode
        SET audio_url = ?
        WHERE id = ?;
      `;
      await connection.promise().query(statement, [item.audio_url, item.id]);
    }
  } catch (error) {
    throw new Error('更新数据库中每期播客的音频地址失败');
  }
}

/***
 * 获取episode音频信息
 */
export const getEpisodesAudioUrlInfo = async (
  id_spotify:string
) => {
   const statement = `
    select 
    id,
    audio_url
   from episode
   where podcast_id = ?;
   `
   const [data] = await connection.promise().query(statement,id_spotify);

   if (data) {
       return data
    } else {
       throw new Error('获取数据库中每期音频文件地址失败');
    }   
}

export const saveTranscript = async (transcriptInfo: any) => {
  const statement = `
    INSERT INTO transcript 
    (podcast_id, episode_id, episodeNumber, transcript, metaSummary, transSummary, paragraphs, words) 
    VALUES ?;
  `;

  const values = transcriptInfo.map(item => [
      item.podcast_id,
      item.episode_id,
      item.episodeNumber,
      item.transcript,
      item.metaSummary,
      item.transSummary,
      item.paragraphs,
      item.words,
  ]);
  
    try {
      const [data] = await connection.promise().query(statement, [values]);

      return data;   
    } catch (error) {
      throw new Error('将episodes保存到数据库中失败');
    }
};

/***
 * 获取数据库中episodes的相关信息，包括文字稿，音频等，之后会存入本地
 */
export const getEpisodesInfoPack = async (
  podcast_id: number
) => {
  const statement = `
    SELECT 
      e.id,
      e.podcast_id,
      e.episodeNumber,
      p.podcast_name,
      e.name,
      e.transcript_sign,
      e.audio_url,
      t.paragraphs,
      t.metaSummary,
      t.transSummary
    FROM episode e
    JOIN podcast p ON e.podcast_id = p.id
    JOIN transcript t ON e.id = t.episode_id
    WHERE e.podcast_id = ?
    ORDER BY e.episodeNumber ASC
    `;

    try {
      const [data] = await connection.promise().query(statement, podcast_id);
      return data
    } catch (error) {
      console.error('获取三表拼接的数据失败:', error.message);
      throw new Error(`获取三表拼接的数据失败:${error.message}`);
    }
}