import { connection } from "../app/connect/mysql";

 /***
  * 保存episodes
  */
 export const saveEpisodes = async (
    episodeList: any
  ) => {
    const statement = `
    INSERT INTO episodes 
    (podcast_name, podcast_id_spotify, podcast_id_taddy, podcast_image_spotify, name, id_taddy, image, audioUrl, update_time, episodeNumber, duration, description, trans_description, transcript_sign,podcast_id) 
    VALUES ?;
  `;
  const values = episodeList.map(episode => [
    episode.podcast_name,
    episode.podcast_id_spotify,
    episode.podcast_id_taddy,
    episode.podcast_image_spotify,
    episode.name,
    episode.id_taddy,
    episode.image,
    episode.audioUrl,
    episode.update_time,
    episode.episodeNumber,
    episode.duration,
    episode.description,
    episode.trans_description,
    episode.transcript_sign,
    episode.podcast_id
  ]);
    const [data] = await connection.promise().query(statement, [values]);
    if (data) {
      return data
   } else {
      throw new Error('将episodes保存到数据库中失败');
   }   
  }

export const deletesaveEpisodes = async (
    podcast_id_spotify: string
 ) => {
    const statement = `
       DELETE FROM episodes 
       WHERE podcast_id_spotify = ?
     `;
     const [data] = await connection.promise().query(statement,podcast_id_spotify);
     
     if (data) {
       return data
    } else {
       throw new Error('从数据库中删除播客episodes失败');
    }   
 }



