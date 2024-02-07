import express from "express";
import cors from 'cors'
import { ALLOW_ORIGIN } from './app.config'


import appRouter from "./app.router";
import podcastRouter from '../podcast/podcast.router'
import episodeRouter from '../episode/episode.router'
import transcriptRouter from '../transcript/transcript.router'
import testRouter from '../test/test.router'
import tagRouter from '../tag/tag.router'
import specialTestRouter from '../specialTest/specialTest.router'
import storageRouter from '../storage/storage.router'


import { appErrorHandler } from "./app.errorHandler";
import { podcastErrorHandler } from '../podcast/podcast.errorHandler'
import { episodeErrorHandler } from '../episode/episode.errorHandler'
import { transcriptErrorHandler } from '../transcript/transcript.errorHandler'
import { tagErrorHandler } from '../tag/tag.errorHandler'
import {testErrorHandler} from '../test/test.errorHandler'
import bodyParser from "body-parser";
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
app.use(
    storageRouter,
    specialTestRouter,
    appRouter,
    podcastRouter,
    episodeRouter,
    transcriptRouter,
    testRouter,
    tagRouter)

app.use(
    testErrorHandler,
    tagErrorHandler,
    podcastErrorHandler,
    episodeErrorHandler,
    transcriptErrorHandler,
    appErrorHandler)

export default app