
import { Application } from "express";
import validator from "../controllers/jwt.controller";
import { addTransactionController, deleteTransactionController, getDashboardDataController, updateTransactionController } from "../controllers/dashboard.controller";

const dashboardRoutes = (app: Application) => {
    app.get('/api/dashboard', validator, getDashboardDataController);
    app.post('/api/transaction/:type', validator,  addTransactionController);
    app.put('/api/transaction/:type/:transaction_id', validator, updateTransactionController);
    app.delete('/api/transaction', validator, deleteTransactionController);
}

export default dashboardRoutes;