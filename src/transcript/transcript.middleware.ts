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
    const episode_id = Number(episodeId)
    const fsids = String(baiduData.fs_id)
    const path = String(baiduData.path)
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

export const findMissFilesInLocalFiles = (path: any) => {

    const fileNumbers = path
    .map((fileName: string) => Number(fileName.split('.')[0])) // 从文件名中提取数字部分
    .filter((number: number) => !isNaN(number)) // 过滤非数字
    .sort((a: number, b: number) => a - b); // 数字排序

    const missingFiles = [];
    let expectedNumber = 1; // 预期的文件标号从1开始
  
    for (const number of fileNumbers) {
      if (number !== expectedNumber) {
        for (let i = expectedNumber; i < number; i++) {
          missingFiles.push(i);
        }
      }
      expectedNumber = number + 1;
    }

    return missingFiles
}