import express from "express";
import cors from 'cors'
import { ALLOW_ORIGIN } from './app.config'


import appRouter from "./app.router";
import podcastRouter from '../podcast/podcast.router'
import episodeRouter from '../episode/episode.router'


import { appErrorHandler } from "./app.errorHandler";
import { podcastErrorHandler } from '../podcast/podcast.errorHandler'
import { episodeErrorHandler } from '../episode/episode.errorHandler'
/**
 * 创建应用
 */
const app = express()

/**
 * 跨域资源共享
 */
app.use(cors({
    origin: ALLOW_ORIGIN,
    exposedHeaders: 'X-Total-Content',
}))

/**
 * 处理json
 */
app.use(express.json({ limit: '300mb' }))
app.use(express.urlencoded({ extended: true }));

app.use(appRouter,podcastRouter,episodeRouter)

app.use(
    podcastErrorHandler,
    episodeErrorHandler,
    appErrorHandler)

export default app