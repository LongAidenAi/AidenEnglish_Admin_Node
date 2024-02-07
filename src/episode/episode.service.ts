import { connection } from "../app/connect/mysql";

 /***
  * 保存episodes
  */
 export const saveEpisodes = async (
    episodeList: any, isFreeSample: number
  ) => {
    const statement = `
    INSERT INTO episode 
    (name,id_taddy,image,audio_url,audio_preview_url,update_time,episodeNumber,transcript_sign,duration,podcast_id,isFreeSample) 
    VALUES ?;
  `;
  const values = episodeList.map((episode: any, index: number) => {

    if(!isFreeSample) isFreeSample = index < 3 ? 1 : 0; 
 
   return [
     episode.name,
     episode.id_taddy,
     episode.image,
     episode.audio_url,
     episode.audio_preview_url,
     episode.update_time,
     episode.episodeNumber,
     episode.transcript_sign,
     episode.duration,
     episode.podcast_id,
     episode.isFreeSample 
   ];
 });
    
    try {
      const [data] = await connection.promise().query(statement, [values]);
      return data
    } catch (error) {
      console.log(error)
      throw new Error('添加每期播客新失败：'+error);
    }
  }

export const deletesaveEpisodes = async (
    podcast_id_spotify: string
 ) => {
    const statement = `
       DELETE FROM episod 
       WHERE podcast_id_spotify = ?
     `;
     const [data] = await connection.promise().query(statement,podcast_id_spotify);
     
     if (data) {
       return data
    } else {
       throw new Error('从数据库中删除播客episodes失败');
    }   
 }



