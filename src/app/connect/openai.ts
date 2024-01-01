import OpenAI from 'openai';
import {
    OPENAI_API_KEY,
    OPENAI_BASEURL_PROXY
  } from '../../app/app.config';

  const openai = new OpenAI({
    apiKey: OPENAI_API_KEY,
    baseURL: OPENAI_BASEURL_PROXY
  });

  export default openai