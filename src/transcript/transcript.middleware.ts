import fs from 'fs'
import PDFDocument from 'pdfkit';
import * as episodeHttps from '../episode/episode.https';
import axios from 'axios';

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

export const sanitizeFilename = (filename: string)  => {
    // 正则表达式匹配所有不允许的字符以及结尾的空格或点号
    const invalidChars = /[<>:"/\\|?*\x00-\x1F]|[\s.]$/g;
    // 替换掉不允许的字符
    return filename.replace(invalidChars, '_');
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

/***
 * 
 */
export const arrangeTranscriptData = (
    transcriptData: any, item: any
) => {
    
    return {
        podcast_id: item.podcast_id,
        episode_id: item.id,
        episodeNumber: item.episodeNumber,
        metaSummary: transcriptData.summary.metaSummary,
        transSummary: transcriptData.summary.transSummary,
        transcript: transcriptData.transcriptInfo.transcript,
        paragraphs:  JSON.stringify(transcriptData.transcriptInfo.paragraphs),
        words: JSON.stringify(transcriptData.transcriptInfo.words)
    }
}

enum FontPath {
    EnglishFontPath = 'F:/Work_Resources/AidenEnglish_Project/AidenEnglish_Admin_Node/src/asset/font/CALIBRI.ttf',
    ChineseFontPath = 'F:/Work_Resources/AidenEnglish_Project/AidenEnglish_Admin_Node/src/asset/font/Alibaba-PuHuiTi-Regular.ttf'
  }
/***
 * 整理文字稿列表信息并转为pdf
 */
export const arrangeTransToPDF = async (
    item: any,episodePathPDF: string
) => {
    const transText = jointTranscript(item.paragraphs.paragraphs)
    const metaSummary = item.metaSummary
    const transSummary = item.transSummary

    const doc = new PDFDocument();
    // 创建文件写入流并将其连接到PDF文档
    const stream = fs.createWriteStream(episodePathPDF);

    doc.pipe(stream);

    // 标题
    doc.font('Helvetica-Bold').fontSize(14).text(item.name, { align: 'center' }).moveDown(2);

    //概述标题
    doc.font('Helvetica-Bold').fontSize(13).text('Overview').moveDown(1);

    //英文概述
    doc.font(FontPath.EnglishFontPath).fontSize(13).text(metaSummary, {
      lineGap: 6,
    }).moveDown(1);

    //中文概述
    doc.font(FontPath.ChineseFontPath).fontSize(11.5).text(transSummary, {
      lineGap: 6,
      characterSpacing: 2
    }).moveDown(2);

    //文字稿标题
    doc.font('Helvetica-Bold').fontSize(13).text('Transcript', { align: 'left' }).moveDown(1);

    //文字稿
    doc.font(FontPath.EnglishFontPath).fontSize(14).text(transText, {
      lineGap: 6,
    });

    // 完成PDF文档的编辑
    doc.end();

    // 监听流的'finish'事件，以确定文件已经写入完成
    stream.on('finish', function() {
      console.log(`${item.episodeNumber}.${item.name}.pdf 创建成功!`);
    });

}

const proxy = {
    host: 'localhost',
    port: 7890,
    protocol: 'http' 
};
/***
 * 下载音频到本地
 */
export const downloadAudio = async (
    item: any,episodePathMP3: string
) => {

    try {
        const response = await axios.get(item.audio_url, {
          responseType: 'stream',
          timeout: 10000,
          proxy: {
            host: proxy.host,
            port: proxy.port,
            protocol: proxy.protocol
          }
        });
    
        // 将响应流保存到文件
        const writer = fs.createWriteStream(episodePathMP3);
    
        // 使用 Promises 处理流事件，以确保文件完全写入磁盘
        await new Promise((resolve, reject) => {
          response.data.pipe(writer);
          let error = null;
          writer.on('error', (err) => {
            error = err;
            writer.close();
            reject(err);
          });
          writer.on('close', () => {
            if (!error) {
              resolve(true);
            }
            // 如果没有错误，文件已正确关闭
          });
        });
    
        console.log(`${item.episodeNumber}.${item.name}.mp3 下载成功！`);
      } catch (error) {
        console.error('下载失败：', error);
      }
}

/***
 * 遍历文字稿每句话，组成一个文本
 */
export const jointTranscript = (
    sentenceList: any
) => {
    let fullText = "";
    for (let i = 0; i < sentenceList.length; i++) {

       fullText += `${arrangeTime(sentenceList[i].start)}\n`
       for(let j = 0; j < sentenceList[i].sentences.length; j++) {
        fullText += `${sentenceList[i].sentences[j].text} `
       }
       fullText += "\n\n";
    }
    return fullText
}

const arrangeTime = (totalSeconds:any) => {
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.floor(totalSeconds % 60);
  
    const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    return timeString
  }