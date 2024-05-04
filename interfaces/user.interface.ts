export interface IUser {
    user_id : string;
    email : string;
    password : string;
    name : string;
    last_name : string;
    phone : string;
    birth_date : string;
}

export interface ILogin {
    email : string;
    password : string;
}