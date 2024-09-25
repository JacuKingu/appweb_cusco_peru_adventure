import 'dotenv/config';
import mysql from 'mysql2/promise'

// Configura la conexión
export const connection = mysql.createPool({
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

connection.getConnection()
  .then(function(connection) {
    console.log('Conectado a MySQL');
    connection.release(); // Liberar la conexión de vuelta al pool
  })
  .catch(function(err) {
    console.error('Error en la conexión a la base de datos:', err);
  });
