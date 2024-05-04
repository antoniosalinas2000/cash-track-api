import express from 'express';
import { verifyToken } from '../models/jwt.sql.model';

const validator = express.Router();

export const verifyTokenMiddleware = (req: any, res: any, next: any) => {
    try {
        const token = req.headers.authorization?.split("Bearer ")[1];
        if (!token) {
            return res.status(401).send({ message: "Authorization token missing" });
        }

        verifyToken(token, (isValid: boolean) => {
            if (isValid) {
                next();
            } else {
                res.status(401).send({ message: "Invalid token" });
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ message: "Error verifying token" });
    }
};

validator.use((req: any, res: any, next: any) => {
    if (req.headers.authorization) {
        const token = req.headers.authorization.split(' ')[1];
        if (token) {
            verifyToken(token, (verifiedModel: any) => {
                if (verifiedModel) {
                    req.useToken = true;
                    req.decoded = verifiedModel;
                    next();
                } else {
                    res.status(403).send({ message: 'Token not valid' });
                }
            });
        } else {
            res.status(401).send({ message: "Authorization token missing" });
        }
    } else {
        let queryJwt = req.query.jwt;
        if (queryJwt) {
            verifyToken(queryJwt, (verifiedModel: any) => {
                if (verifiedModel) {
                    req.useToken = true;
                    req.decoded = verifiedModel;
                    next();
                } else {
                    res.status(403).send({ message: 'Token not valid' });
                }
            });
        } else {
            res.status(401).send({ message: "Authorization token missing" });
        }
    }
});


export default validator;