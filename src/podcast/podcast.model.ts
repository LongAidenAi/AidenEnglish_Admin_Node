export interface PodcastInfoModel {
    podcast_name: string
    id_spotify: string
    id_taddy: string
    id_itunes: string
    image_spotify: string
    image_taddy: string
    total_episodes_spotify: number
    total_episodes_taddy: number
    lastest_updatetime_spotify: string
    lastest_updatetime_taddy: string
    description: string
    trans_description: string
}

export interface updatePodcastInfoModel {
    total_episodes_spotify: number
    total_episodes_taddy: number
    lastest_updatetime_spotify: string
    lastest_updatetime_taddy: string
}