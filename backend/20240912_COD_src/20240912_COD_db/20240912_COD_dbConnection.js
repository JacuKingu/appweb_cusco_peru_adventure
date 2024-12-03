import 'dotenv/config';
import mysql from 'mysql2/promise';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';
import bcrypt from 'bcrypt';

// Obtener la ruta actual del archivo usando `import.meta.url`
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Crear la ruta al archivo SQL
const initScriptPath = join(__dirname, '../../20240912_COD_data.sql');

// Leer el contenido del archivo SQL
const initScript = fs.readFileSync(initScriptPath, 'utf-8');

// Configura la conexión de pool
export const connection = mysql.createPool({
  host: process.env.DB_SERVER,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});


// Función para verificar si la base de datos existe
async function verificarExistenciaBaseDatos() {
  try {
    const connection = await mysql.createConnection({
      host: process.env.DB_SERVER,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    const [results] = await connection.query(`SHOW DATABASES LIKE '${process.env.DB_NAME}'`);
    connection.end();
    return results.length > 0; // Devuelve true si la base de datos existe
  } catch (error) {
    console.error('Error al verificar la existencia de la base de datos:', error.message);
    throw error;
  }
}

async function verificarExistenciaTablas() {
  try {
    const [rows] = await connection.query("SHOW TABLES LIKE 'usuarios'");
    return rows.length > 0;
  } catch (error) {
    console.error('Error al verificar la existencia de la tabla: ', error.message);
    throw error
  }
}

async function insertarUsuario(nombre, contraseña, rol) {
  try {
    const [rows] = await connection.query(
      'SELECT * FROM usuarios WHERE nombre = ?', [nombre]
    );

    if (rows.length === 0) {
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(contraseña, saltRounds);
      await connection.query(
        'INSERT IGNORE INTO usuarios (nombre, contraseña, rol) VALUES (?, ?, ?)',
        [nombre, hashedPassword, rol]
      );

      console.log(`Usuario ${nombre} insertado exitosamente con contraseña encriptada.`);
    } else {
      console.log(`El usuario ${nombre} ya existe.`);
    }
  } catch (error) {
    console.error(`Error al insertar usuario ${nombre}:`, error.message);
    throw error;
  }
}

// Función para inicializar la base de datos
export async function iniciarDatabase() {
  try {
    const dbExiste = await verificarExistenciaBaseDatos();

    if (dbExiste) {
      console.log(`Conexión exitosa: la base de datos '${process.env.DB_NAME}' ya existe.`);

      const tablasExisten = await verificarExistenciaTablas();
            if (!tablasExisten) {
                console.log('Las tablas no existen. Creando tablas...');
                
                const tempConnection = await mysql.createConnection({
                    host: process.env.DB_SERVER,
                    user: process.env.DB_USER,
                    password: process.env.DB_PASSWORD,
                    multipleStatements: true
                });
                
                await tempConnection.query(`USE ${process.env.DB_NAME}`);
                await tempConnection.query(initScript);
                console.log('Tablas y procedimientos almacenados creadas exitosamente.');
                tempConnection.end();
            } else {
                console.log('Las tablas ya existen. No se necesita recrearlas.');
            }

      // Inserción de usuarios después de la verificación o creación de tablas
      await insertarUsuario('admin', 'qwerasdfzxcv', 'admin');
      await insertarUsuario('asd', 'qwerasdfzxcv', 'asesor');
    } else {
      console.log(`La base de datos '${process.env.DB_NAME}' no existe. Creando...`);
      
      const tempConnection = await mysql.createConnection({
        host: process.env.DB_SERVER,
        user: process.env.DB_USER,
        password: process.env.DB_PASSWORD,
        multipleStatements: true
    });

      await tempConnection.query(`CREATE DATABASE ${process.env.DB_NAME}`);
      await tempConnection.query(`USE ${process.env.DB_NAME}`);
      await tempConnection.query(initScript);

      console.log('Base de datos, tablas y procedimientos almacenados creadas exitosamente.');

      await insertarUsuario('admin', 'qwerasdfzxcv', 'admin');
      await insertarUsuario('asd', 'qwerasdfzxcv', 'asesor');
      tempConnection.end(); // Cerrar la conexión después de la inicialización
    }
  } catch (error) {
    console.error('Error al inicializar la base de datos:', error.message);
    throw error; // Lanzar el error para manejarlo en la llamada
  }
}

// Probar conexión al iniciar
connection.getConnection()
  .then(conn => {
    console.log('Conectado a MySQL');
    conn.release(); // Liberar la conexión de vuelta al pool
  })
  .catch(err => {
    console.error('La base de datos aun no existe');
  });
