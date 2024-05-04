import express, { Express, Request, Response, NextFunction } from 'express';
import helmet from 'helmet';
import cors from 'cors';
import dotenv from 'dotenv';
import userRoutes from './app/routes/user.route';
import dashboardRoutes from './app/routes/dashboard.route';

// Asegúrate de configurar dotenv antes de importar los módulos que usan las variables de entorno.
dotenv.config({ path: process.env.NODE_ENV === 'development' ? '.env.local' : '.env' });

const app: Express = express();
const PORT: number = parseInt(process.env.PORT || '3500');

// Aplicación de middleware de seguridad
app.use(helmet());

// Configuración de CORS
app.use(cors());

// Parseo de JSON y datos codificados en URL
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true }));

userRoutes(app);
dashboardRoutes(app);

// Middleware de manejo de errores
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error(err);  // Loguear el error
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";
  res.status(status).json({ message });
});


// Iniciar el servidor
app.listen(PORT, () => {
  console.log(`Express server is listening at ${PORT}`);
});
