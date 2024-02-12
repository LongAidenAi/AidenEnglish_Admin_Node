import { connection } from "../app/connect/mysql";



export const getPodcastImageUrl = async (
    podcastId: number
) => {
    const statement = `
     select 
       image_url,
       id
    from podcast
    where id = ?
    `

    const [data] = await connection.promise().query(statement, podcastId);
    return data[0]
}


export const usePodcastImageReplaceEpi = async (
    podcast_id: number,
    image_url: string
) => {
    const statement = `
    UPDATE 
      episode 
    SET image = ?
    where podcast_id = ?

    `

   await connection.promise().query(statement, [image_url,podcast_id]);

}


export const getEpisodeImageList = async (
    podcastId: number
) => {
    const statement = `
    select 
      podcast_id,
      image,
      id,
      episodeNumber
   from episode
   where podcast_id = ?
   `

   const [data] = await connection.promise().query(statement, podcastId);

   return data
}


export const updateEpisodeImage = async (
    id: number,
    image: string
) => {
    const statement = `
    UPDATE 
      episode 
    SET image = ?
    where id = ?
   `
    
   await connection.promise().query(statement, [image,id]);
   console.log(`已修改id为:${id}的图片, 成功`)
}


export const getEpisodePreAudioList = async (
    podcastID: number
) => {
    const statement = `
     select 
        podcast_id,
        id,
        audio_preview_url,
        episodeNumber
     from 
        episode
    where podcast_id = ?
    `
    const [data] = await connection.promise().query(statement, podcastID);

    return data
}

export const getEpisodeAudioList = async (
    podcastID: number
) => {
    const statement = `
     select 
        podcast_id,
        id,
        audio_url,
        episodeNumber
     from 
        episode
    where podcast_id = ?
    `
    const [data] = await connection.promise().query(statement, podcastID);

    return data
}


export const updateEpisodePreAudio = async (
    podcastId: number, 
    id: number, 
    preAudio: string
) => {
    const statement = `
       UPDATE 
       episode 
     SET audio_preview_url = ?
     where id = ? and podcast_id = ?
    `
    await connection.promise().query(statement, [preAudio,id,podcastId ]);
    console.log(`修改数据库pre_audio成功,播客id: ${podcastId}, episode的id: ${id}`)
}


export const updateEpisodeAudio = async (
    podcastId: number, 
    id: number, 
    audio: string
) => {
    const statement = `
    UPDATE 
       episode 
     SET audio_url = ?
     where id = ? and podcast_id = ?
    `
    await connection.promise().query(statement, [audio,id,podcastId ]);
    console.log(`修改数据库audio成功,播客id: ${podcastId}, episode的id: ${id}`)
}