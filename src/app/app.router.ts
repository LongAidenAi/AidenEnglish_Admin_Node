import express from 'express';
import * as appController from './app.controller';


const router = express.Router();

router.post('/app/spotifytoken',appController.getSpotifyToken)



export default router;