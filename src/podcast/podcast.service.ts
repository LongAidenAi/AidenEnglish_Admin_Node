import { connection } from "../app/connect/mysql";
import { PodcastInfoModel, updatePodcastInfoModel } from "./podcast.model";

/***
 * 向数据库添加新播客信息
 */
export const saveNewPodcastInfo = async (
    options: PodcastInfoModel
  ) => {
        const statement = `
        INSERT INTO podcasts
        SET ?;
        `
        const [data] = await connection.promise().query(statement, options);

        if (data) {
            return options;
          } else {
            throw new Error('向数据库添加新播客信息失败');
       }
  }
  
 /***
 * 得到数据库中的所有播客信息
 */
export const ObtainAllPodcasts = async () => {
   const statement = `
    SELECT * FROM podcasts;
   `
   const [data] = await connection.promise().query(statement);
   
   if (data) {
      return data;
   } else {
      throw new Error('从数据库中获取所有播客信息失败');
   }         
}

/**
 * 根据id_spotify删除对应播客
 */
export const deletePodcastById = async (
   id_spotify: string
) => {
   
   const statement = `
      DELETE FROM podcasts 
      WHERE id_spotify = ?
    `;
    const [data] = await connection.promise().query(statement,id_spotify);
    
    if (data) {
      return data
   } else {
      throw new Error('从数据库中删除播客失败');
   }   
}
   

/**
 * 根据id_taddy更新播客信息
 */
export const upatePodcast = async (
   updatePodcastInfo: updatePodcastInfoModel,
   id_taddy: string
) => {
   
   const statement = `
     UPDATE podcasts
     SET ?
     WHERE id_spotify = ?;
   `;
    const [data] = await connection.promise().query(statement,[updatePodcastInfo,id_taddy]);
    
    if (data) {
      return data
   } else {
      throw new Error('根据id_taddy更新播客信息失败');
   }   
}

/**
 * 根据spotify的id获取到对应播客的信息
 */
export const getPodcastById = async (
   id_spotify: string
 ) => {
   const statement = `
     select 
       *
     from podcasts
     where id_spotify = ?
     `
     const [data] = await connection.promise().query(statement, id_spotify);

      return data[0] ? data[0] : null

 }

