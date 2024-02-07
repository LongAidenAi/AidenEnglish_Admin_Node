import { connection } from "../app/connect/mysql";



export const getPodcastImageUrl = async (
    id_spotify: string
) => {
    const statement = `
     select 
       image_url
    from podcast
    where id_spotify = ?
    `

    const [data] = await connection.promise().query(statement, id_spotify);

    return data[0].image_url
}


export const usePodcastImageReplaceEpi = async (
    image_url: string
) => {
    const statement = `
    UPDATE 
      episode 
    SET image = ?;
    `

   await connection.promise().query(statement, image_url);

}


export const getEpisodeImageList = async (
    id_spotify: string
) => {
    const statement = `
    select 
      podcast_id,
      image,
      id
   from episode
   `

   const [data] = await connection.promise().query(statement, id_spotify);

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
   console.log(`已修改id为:${id}, 成功`)
}


export const getEpisodePreAudioList = async (
    podcastID: number
) => {
    const statement = `
     select 
        podcast_id,
        id,
        audio_preview_url
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
        audio_url
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
    console.log(`修改pre_audio成功,播客id: ${podcastId}, episode的id: ${id}`)
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
    console.log(`修改audio成功,播客id: ${podcastId}, episode的id: ${id}`)
}