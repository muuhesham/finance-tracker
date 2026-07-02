import cors from 'cors';
import { CLIENT_URL } from './env.js';

const corsOptions = {
    origin: CLIENT_URL,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    credentials: true,
}

export default cors(corsOptions);