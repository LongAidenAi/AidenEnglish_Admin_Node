import * as episodeHttps from '../episode/episode.https';
export const arrangeTranscriptInfo = async (DeepGramData:any) => {
    const metaSummary = DeepGramData.results.summary.short
    const transSummary = await episodeHttps.transDescTool(metaSummary)
    return {
        summary: {
            metaSummary,transSummary
        },
        transcriptInfo: DeepGramData.results.channels[0].alternatives[0]
    }
}

export const formatfileName = (item: any) => {
    const specialCharsRegex = /[^\w\s]/g;

    return {
        podcastDir: `${String(item.podcast_id)}.${String(item.podcast_name).replace(specialCharsRegex,'_')}`,
        episodeDir: `${String(item.episodeNumber)}.${String(item.name).replace(specialCharsRegex,'_')}`
    }
}

export const arrangeEpisodesTranscriptData = (episodeId:any,baiduData: any) => {
    const episode_id = episodeId ? Number(episodeId) : null
    const fsids = baiduData.fs_id ? String(baiduData.fs_id) : ''
    const path = baiduData.path ? String(baiduData.path) : ''
    return {
        episode_id,
        fsids,
        path 
    }
}

export const convertToArray = (episodesInfo:any) => {
    const dataString = JSON.stringify(episodesInfo);
    const dataArray = JSON.parse(dataString);
    return dataArray
}