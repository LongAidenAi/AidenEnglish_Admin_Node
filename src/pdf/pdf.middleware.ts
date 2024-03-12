import { jointTranscript } from '../transcript/transcript.middleware';
import * as episodeHttps from '../episode/episode.https';
import fs from 'fs'
import PDFDocument from 'pdfkit';

export const arrangeTranscriptInfo = async (DeepGramData:any) => {
    const metaSummary = DeepGramData.results.summary.short
    const transSummary = await episodeHttps.transDescTool(metaSummary)
    const paragraphs = DeepGramData.results.channels[0].alternatives[0].paragraphs.paragraphs
    const transText = jointTranscript(paragraphs)
    return {
        summary: {
            metaSummary,transSummary
        },
        transText
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
    transcriptInfo: any,localPath: string,titlePDF: string
) => {
    const transText = transcriptInfo.transText
    const metaSummary = transcriptInfo.summary.metaSummary
    const transSummary = transcriptInfo.summary.transSummary

    const doc = new PDFDocument();
    // 创建文件写入流并将其连接到PDF文档
    const stream = fs.createWriteStream(localPath);

    doc.pipe(stream);

    // 标题
    doc.font('Helvetica-Bold').fontSize(14).text(titlePDF, { align: 'center' }).moveDown(2);

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


    //官网介绍
    doc.font(FontPath.ChineseFontPath).fontSize(11.5).text(
        '根据英语分级读物--可理解性输入的理念，艾登英语团队设计出了国内首个英语分级听力在线平台。平台提供了上万集播客音频以及配套文字稿，并通过七项指标，包括:等级、风格、语速、主题、时长、发音、内容深度等，进行了35种分类。针对英语学习者，对播客的难度和等级进行评级。访问下方链接，即可体验：',
        {
        lineGap: 6,
        characterSpacing: 2
        }).moveDown(1);


    //官网链接
    const url = 'https://www.aidenenglish.cn';
    const linkText = '艾登英语分级英语听力平台(www.aidenenglish.cn)';
    // 设置链接文本颜色
    const linkColor = '#329e8f';

    // 绘制文本，并在相同位置绘制链接
    doc.fillColor(linkColor).text(linkText, {
      link: url,
      underline: true
    }).moveDown(2);


    const noteColor = '#A8ABB2';
    //概述标题
    doc
    .font(FontPath.ChineseFontPath)
    .fontSize(11.5)
    .fillColor(noteColor) // 设置文本颜色
    .text(
        '注：文字稿由 艾登英语 提供，可在b站，公众号，抖音等平台搜索:艾登英语，获取更多学习内容。',
        {
        lineGap: 6,
        characterSpacing: 2
        }).moveDown(1);

    // 完成PDF文档的编辑
    doc.end();

    // 监听流的'finish'事件，以确定文件已经写入完成
    stream.on('finish', function() {
      console.log(`pdf 创建成功!`);
    });

}


/***
 * 整理文字稿列表信息并转为pdf,没有官网引流链接
 */
export const arrangeTransToPDF_v2 = async (
  transcriptInfo: any,localPath: string,titlePDF: string
) => {
  const transText = transcriptInfo.transText
  const metaSummary = transcriptInfo.summary.metaSummary
  const transSummary = transcriptInfo.summary.transSummary

  const doc = new PDFDocument();
  // 创建文件写入流并将其连接到PDF文档
  const stream = fs.createWriteStream(localPath);

  doc.pipe(stream);

  // 标题
  doc.font('Helvetica-Bold').fontSize(14).text(titlePDF, { align: 'center' }).moveDown(2);

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

  const noteColor = '#A8ABB2';
  //概述标题
  doc
  .font(FontPath.ChineseFontPath)
  .fontSize(11.5)
  .fillColor(noteColor) // 设置文本颜色
  .text(
      '注：文字稿由 艾登英语 提供，可在b站，公众号，抖音等平台搜索:艾登英语，获取更多学习内容。',
      {
      lineGap: 6,
      characterSpacing: 2
      }).moveDown(1);

  // 完成PDF文档的编辑
  doc.end();

  // 监听流的'finish'事件，以确定文件已经写入完成
  stream.on('finish', function() {
    console.log(`pdf 创建成功!`);
  });

}
    // doc.font(FontPath.ChineseFontPath).fontSize(16).text('分级英语播客一站式学习平台', { align: 'center' }).moveDown(2);

    //     //官网介绍
    // doc.font(FontPath.ChineseFontPath).fontSize(13).text(
    //     '根据英语分级读物--可理解性输入的理念，艾登英语团队设计出了国内首个分级英语听力在线平台。',
    //     {
    //     lineGap: 6,
    //     characterSpacing: 2
    //     }).moveDown(1);

    // //官网介绍
    // doc.font(FontPath.ChineseFontPath).fontSize(13).text(
    //     '平台提供了上万集播客音频以及配套文字稿，并通过七项指标，包括:等级、风格、语速、主题、时长、发音、内容深度等，进行了35种分类。针对英语学习者，对播客的难度和等级进行评级。访问下方链接，即可体验：',
    //     {
    //     lineGap: 6,
    //     characterSpacing: 2
    //     }).moveDown(1);

    // const url = 'https://www.aidenenglish.cn';
    // const linkText = '分级英语播客一站式学习平台(www.aidenenglish.cn)';
    // // 设置链接文本颜色
    // const linkColor = '#329e8f';

    // // 绘制文本，并在相同位置绘制链接
    // doc.fillColor(linkColor)
    // .fontSize(14.5)
    // .text(linkText, {
    //   link: url,
    //   underline: true,
    //   align: 'center'
    // }).moveDown(2);