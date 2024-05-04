import { Application } from "express";
import { createUserController, loginController } from "../controllers/user.controller";
import validator from "../controllers/jwt.controller";
import validateToken from "../controllers/validation.controller";

const userRoutes = (app: Application) => {
    app.post('/api/user', createUserController);
    app.post('/api/login', loginController);
    app.get("/api/validate/session", validator, validateToken);
}

export default userRoutes;