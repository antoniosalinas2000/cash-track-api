import { Pool, RowDataPacket, OkPacket, ResultSetHeader, FieldPacket } from "mysql2";
import { ILogin, IUser } from "../../interfaces/user.interface";
import db from "./db";
import bcrypt from "bcrypt";
import { nanoid } from "nanoid";

async function hashPassword(password: string): Promise<string> {
    const saltRounds = 10; // or another appropriate number
    return bcrypt.hash(password, saltRounds);
}

interface ResultData<T = IUser | IUser[]> {
    status: number;
    message: string;
    data?: T;
}

export async function createUser(user: IUser): Promise<ResultData> {
    const hashedPassword = await hashPassword(user.password);
    const user_id = nanoid(21);

    const sql = "INSERT INTO user (user_id, email, password, name, last_name, phone, birth_date) VALUES (?, ?, ?, ?, ?, ?, ?)";

    try {
        const result = await db.promise().query(
            sql,
            [
                user_id,
                user.email,
                hashedPassword,
                user.name,
                user.last_name,
                user.phone,
                user.birth_date
            ]
        );
        return { status: 200, message: "User created", data: { ...user } };
    } catch (err: any) {
        console.error(err);
        return err;
    }
};

export async function login(login: ILogin): Promise<ResultData> {
    const sql = "SELECT * FROM user WHERE email = ?";
    try {
        const [results] = await db
        .promise()
        .query<RowDataPacket[]>
        ("SELECT * FROM user WHERE email = ?", [login.email]);
        if (results.length === 0) {
            return { status: 404, message: "User not found" };
        }
        const user = results[0] as IUser;
        const passwordMatch = await bcrypt.compare(login.password, user.password);
        if (passwordMatch) {
            return { status: 200, message: "Login successful", data: { ...user } };
        } else {
            return { status: 401, message: "Invalid password" };
        }
    }
    catch (error) {
        throw error;
    }
};


