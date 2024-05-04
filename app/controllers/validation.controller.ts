import { NextFunction, Response } from "express";

const validateToken = (req: any, res: Response, next: NextFunction) => {
    if (req.useToken){
        res.send({message: 'Token is valid'})
    } else {
        res.send({message: `You don't send a token`})
    }
}

export default validateToken;