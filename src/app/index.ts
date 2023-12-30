import express from "express";
import cors from 'cors'
import { ALLOW_ORIGIN } from './app.config'
import podcastRouter from '../podcast/podcast.router'
import appRouter from "./app.router";

import { podcastErrorHandler } from '../podcast/podcast.errorHandler'
import { appErrorHandler } from "./app.errorHandler";

/**
 * 创建应用
 */
const app = express()

/**
 * 跨域资源共享
 */
app.use(cors({
    origin: ALLOW_ORIGIN,
    exposedHeaders: 'X-Total-Content'
}))

/**
 * 处理json
 */
app.use(express.json())

app.use(podcastRouter,appRouter)

app.use(podcastErrorHandler,appErrorHandler)

export default app