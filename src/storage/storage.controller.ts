import { Request, Response, NextFunction } from 'express';
import qiniu from 'qiniu'
import * as storageHttps from './storage.https'
import * as storageService from './storage.service'
enum Dir {
    podcastDir = 'podcast/image',
    episodeImageDir = 'episode/image',
    episodePreAudioDir = 'episode/pre_audio',
    episodeAudioDir = 'episode/audio'
}
export const savePodcastImageQiniu = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
        const filePath = `${Dir.podcastDir}/${request.file.originalname}`
    try {
        console.log(filePath)
        const data = await storageHttps.saveImageQiniu(filePath, request.file.buffer)
        
        response.status(201).send(data.key)

    } catch (error) {
        console.log('storageController.savePodcastImageQiniu报错')
        console.log(error)
    }
}


export const getImageQiniu = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {resKey} = request.query
    
    try {
        const imageUrlQiniu = await storageHttps.getRecourseQiniu(String(resKey))

        response.status(201).send(imageUrlQiniu)
    } catch (error) {
        console.log('storageController.getPodcastImageQiniu报错')
        console.log(error)
    }
}

/**
 * 替换episode图片
 */
export const usePodcastImageReplaceEpi = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {id_spotify} = request.query
    try {
        const podcastImageUrl = await storageService.getPodcastImageUrl(String(id_spotify))
        
        await storageService.usePodcastImageReplaceEpi(String(podcastImageUrl))

        response.status(201).send()
    } catch (error) {
        console.log(error)
    }
}


export const getEpisodeImageList = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {id_spotify} = request.query
    try {
        const episodeImageList = await storageService.getEpisodeImageList(String(id_spotify))
        
        response.status(201).send(episodeImageList)
    } catch (error) {
        console.log(error)
    }
}


export const saveEpisodeImageQiniu = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const filePath = `${Dir.episodeImageDir}/${request.file.originalname}`
    try {

        const data = await storageHttps.saveImageQiniu(filePath, request.file.buffer)
        
        response.status(201).send(data.key)

    } catch (error) {
        console.log('storageController.saveEpisodeImageQiniu报错')
        console.log(error)
    }
}


export const updateEpisodeImage = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {id,image} = request.body.data
    try {
        await storageService.updateEpisodeImage(id, image)
        response.status(201).send()
    } catch (error) {
        console.log(error)
    }
}

/**
 * 替换audio_preview_url
 */
export const getEpisodePreAudioList = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {podcast_id} = request.query
    try {
        const episodePreAudioList = await storageService.getEpisodePreAudioList(Number(podcast_id))
        
        response.status(201).send(episodePreAudioList)
    } catch (error) {
        console.log(error)
    }
}

/**
 * 替换 audio_url
 */
export const getEpisodeAudioList = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {podcast_id} = request.query
    try {
        const episodeAudioList = await storageService.getEpisodeAudioList(Number(podcast_id))
        
        response.status(201).send(episodeAudioList)
    } catch (error) {
        console.log(error)
    }
}



export const saveEpisodepreAudioQiniu = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const filePath = `${Dir.episodePreAudioDir}/${request.file.originalname}`
    try {

        const data = await storageHttps.saveImageQiniu(filePath, request.file.buffer)
        console.log(`${request.file.originalname} 预览音频文件，保存至七牛云成功`)
        response.status(201).send(data.key)

    } catch (error) {
        console.log('storageController.saveEpisodepreAudioQiniu报错')
        console.log(error)
    }
}


export const saveEpisodeAudioQiniu = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const filePath = `${Dir.episodeAudioDir}/${request.file.originalname}`
    try {

        const data = await storageHttps.saveImageQiniu(filePath, request.file.buffer)
        console.log(`${request.file.originalname} 音频文件，保存至七牛云成功`)
        response.status(201).send(data.key)

    } catch (error) {
        console.log('storageController.saveEpisodeAudioQiniu报错')
        console.log(error)
    }
}


export const getaudioQiniu = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {resKey} = request.query
    
    try {
        const imageUrlQiniu = await storageHttps.getRecourseQiniu(String(resKey))

        response.status(201).send(imageUrlQiniu)
    } catch (error) {
        console.log('storageController.getaudioQiniu报错')
        console.log(error)
    }
}


export const updateEpisodePreAudio = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {podcastId, id, preAudio} = request.body.data
    try {
        await storageService.updateEpisodePreAudio(podcastId, id, preAudio)
        response.status(201).send()
    } catch (error) {
        console.log(error)
    }
}

/***
 * 
 */
export const updateEpisodeAudio = async (
    request: Request,
    response: Response,
    next: NextFunction
) => {
    const {podcastId, id, audio} = request.body.data
    try {
        await storageService.updateEpisodeAudio(podcastId, id, audio)
        response.status(201).send()
    } catch (error) {
        console.log(error)
    }
}