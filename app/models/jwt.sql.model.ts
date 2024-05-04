import * as jwt from 'jsonwebtoken';
import { config } from 'dotenv';
import jwtConfig from '../../config/jwt.config';

config();

export const createToken = (payload: any) => {
    try {
        let token = jwt.sign(payload, jwtConfig.key as string, {expiresIn: 43200}); //12 hours
        return token;
    }
    catch (error) {
        console.error(error);
        return '';
    }
}

export const verifyToken = (token: string, callback: any) => {
    jwt.verify(token, jwtConfig.key as string, (error: any, decoded: any) => {
        if (error) {
            callback(false);
        }
        else {
            callback(decoded);
        }
    });
}

export const destroyToken = (token: string, callback: any) => {
    jwt.verify(token, jwtConfig.key as string, (error: any, decoded: any) => {
        if (error) {
            callback(false);
        }
        else {
            callback(true);
        }
    });
}