import mysql from 'mysql2';
import { config } from 'dotenv';

config();

let auth = {
    //socketPath: process.env.DB_HOST,
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB,
    port:3306,
    multipleStatements: true,
    enableKeepAlive: true,
    keepAliveInitialDelay: 300000,
    waitForConnections: true,
    connectionLimit: 10,
    timezone: '+00:00'
}

const connection = mysql.createPool(auth);

connection.getConnection((error, conn) => {
    if (error) {
        console.error('Error connecting to the database:', error.message);
    } else {
        console.log('Successfully connected to the database.');
        conn.release(); // release the connection back to the pool
    }
});

export default connection;
