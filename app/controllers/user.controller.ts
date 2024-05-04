import { Request, Response } from "express";
import { ILogin, IUser } from "../../interfaces/user.interface";
import db from '../models/db';
import { isCustomError } from "../../interfaces/error.interface";
import { createToken } from "../models/jwt.sql.model";
import { createUser, login} from "../models/user.model";


export const createUserController = async (req: Request, res: Response): Promise<void> => {
    const newUser: IUser = req.body as IUser; // Type assertion to ensure proper request body parsing middleware is in place
    try {
        const result = await createUser(newUser);
        res.status(result.status).json({ message: result.message, data: result.data, error: false });
    } catch (error) {
        if (isCustomError(error)) {
            res.status(error.status).json({ message: error.message, error: true });
        } else {
            // If the error is not a CustomError, handle it as a generic server error
            console.error('Unexpected error type', error);
            res.status(500).json({ message: "Internal Server Error", error: true });
        }
    }
};


export const loginController = async (req: Request, res: Response): Promise<void> => {
    const body : ILogin = req.body as ILogin; // Type assertion to ensure proper request body parsing middleware is in place
    try {
        const result = await login(body);
        if (result.status === 200) {
            const token = createToken(result.data);
            res.status(result.status).json({ message: result.message, data: result.data, token, error: false });
        } else {
            res.status(result.status).json({ message: result.message, error: true });
        }
    } catch (error) {
        if (isCustomError(error)) {
            res.status(error.status).json({ message: error.message, error: true });
        } else {
            // If the error is not a CustomError, handle it as a generic server error
            console.error('Unexpected error type', error);
            res.status(500).json({ message: "Internal Server Error", error: true });
        }
    }
}