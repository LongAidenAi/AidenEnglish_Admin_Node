import { createClient} from "@deepgram/sdk";
import {DEEPGRAM_APIKEY} from '../app.config'

export const deepgram = createClient(DEEPGRAM_APIKEY);



