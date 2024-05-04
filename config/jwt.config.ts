import { config } from 'dotenv';
config();

const JWTConfig = {
    key: process.env.APP_JWT_SECRET
}

export default JWTConfig;