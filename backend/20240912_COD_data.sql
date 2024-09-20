CREATE DATABASE cpa;
USE cpa;

-- Tabla de pdf con almacenamiento de contenido
CREATE TABLE pdf (
    id_pdf INT AUTO_INCREMENT PRIMARY KEY,
    nombre_archivo VARCHAR(255) NOT NULL,
    contenido LONGBLOB,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BIT DEFAULT 1
);

-- Tabla de tours
CREATE TABLE tours (
    id_tour INT AUTO_INCREMENT PRIMARY KEY,
    nombre_tour VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion INT, -- Duración del tour en días
    precio DECIMAL(10, 2),
    categoria VARCHAR(50),
    activo BIT DEFAULT 1
);

-- Tabla de Grupos de Viaje
CREATE TABLE grupos (
    id_grupo INT AUTO_INCREMENT PRIMARY KEY,
    id_pdf INT,
    nombre_grupo VARCHAR(100),
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BIT DEFAULT 1,
    FOREIGN KEY (id_pdf) REFERENCES pdf(id_pdf)
);

-- Tabla de Clientes
CREATE TABLE clientes (
    id_cliente INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    email VARCHAR(100) NULL,
    telefono VARCHAR(15) NULL,
    fecha_nacimiento DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_grupo INT,
    activo BIT DEFAULT 1,
    FOREIGN KEY (id_grupo) REFERENCES grupos(id_grupo)
);

-- Tabla de pasaporte
CREATE TABLE pasaporte (
    id_pasaporte INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    numero_pasaporte VARCHAR(20) UNIQUE NOT NULL,
    pais_emision VARCHAR(100),
    fecha_expiracion DATE,
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BIT DEFAULT 1,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

-- Tabla de Recomendaciones
CREATE TABLE recomendaciones (
    id_recomendacion INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_tour INT,
    fecha_recomendacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contenido TEXT,
    activo BIT DEFAULT 1, 
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_tour) REFERENCES tours(id_tour)
);

-- Tabla de reservas
CREATE TABLE reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_tour INT,
    fecha_reserva TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'confirmada', 'cancelada') DEFAULT 'pendiente',
    activo BIT DEFAULT 1, 
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_tour) REFERENCES tours(id_tour)
);

-- Tabla de Usuarios Administrativos
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'asesor') DEFAULT 'asesor',
    fecha_creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo BIT DEFAULT 1 
);

DELIMITER //

-- Procedimientos para la tabla de pdf
CREATE PROCEDURE insertarPdf(IN nombre VARCHAR(255), IN contenido BLOB)
BEGIN
    INSERT INTO pdf (nombre_archivo, contenido) VALUES (nombre, contenido);
END //

CREATE PROCEDURE obtenerPdfsActivos()
BEGIN
    SELECT * FROM pdf WHERE activo = 1;
END //

CREATE PROCEDURE actualizarPdf(IN id INT, IN nuevo_nombre VARCHAR(255), IN nuevo_contenido BLOB)
BEGIN
    UPDATE pdf SET nombre_archivo = nuevo_nombre, contenido = nuevo_contenido WHERE id_pdf = id AND activo = 1;
END //

CREATE PROCEDURE eliminarPdf(IN id INT)
BEGIN
    UPDATE pdf SET activo = 0 WHERE id_pdf = id;
END //

-- Procedimientos para la tabla de tours
CREATE PROCEDURE insertarTour(IN nombre VARCHAR(100), IN descripcion TEXT, IN duracion INT, IN precio DECIMAL(10, 2), IN categoria VARCHAR(50))
BEGIN
    INSERT INTO tours (nombre_tour, descripcion, duracion, precio, categoria) VALUES (nombre, descripcion, duracion, precio, categoria);
END //

CREATE PROCEDURE obtenerToursActivos()
BEGIN
    SELECT * FROM tours WHERE activo = 1;
END //

CREATE PROCEDURE actualizarTour(IN id INT, IN nuevo_nombre VARCHAR(100), IN nueva_descripcion TEXT, IN nueva_duracion INT, IN nuevo_precio DECIMAL(10, 2), IN nueva_categoria VARCHAR(50))
BEGIN
    UPDATE tours SET nombre_tour = nuevo_nombre, descripcion = nueva_descripcion, duracion = nueva_duracion, precio = nuevo_precio, categoria = nueva_categoria WHERE id_tour = id AND activo = 1;
END //

CREATE PROCEDURE eliminarTour(IN id INT)
BEGIN
    UPDATE tours SET activo = 0 WHERE id_tour = id;
END //

-- Procedimientos para la tabla de grupos
CREATE PROCEDURE insertarGrupo(IN id_pdf INT, IN nombre VARCHAR(100))
BEGIN
    INSERT INTO grupos (id_pdf, nombre_grupo) VALUES (id_pdf, nombre);
END //

CREATE PROCEDURE obtenerGruposActivos()
BEGIN
    SELECT * FROM grupos WHERE activo = 1;
END //

CREATE PROCEDURE actualizarGrupo(IN id INT, IN nuevo_id_pdf INT, IN nuevo_nombre VARCHAR(100))
BEGIN
    UPDATE grupos SET id_pdf = nuevo_id_pdf, nombre_grupo = nuevo_nombre WHERE id_grupo = id AND activo = 1;
END //

CREATE PROCEDURE eliminarGrupo(IN id INT)
BEGIN
    UPDATE grupos SET activo = 0 WHERE id_grupo = id;
END //

-- Procedimientos para la tabla de clientes
CREATE PROCEDURE insertarCliente(IN nombre VARCHAR(100), IN apellido VARCHAR(100), IN email VARCHAR(100), IN telefono VARCHAR(15), IN fecha_nacimiento DATE, IN id_grupo INT)
BEGIN
    INSERT INTO clientes (nombre, apellido, email, telefono, fecha_nacimiento, id_grupo) VALUES (nombre, apellido, email, telefono, fecha_nacimiento, id_grupo);
END //

CREATE PROCEDURE obtenerClientesActivos()
BEGIN
    SELECT * FROM clientes WHERE activo = 1;
END //

CREATE PROCEDURE actualizarCliente(IN id INT, IN nuevo_nombre VARCHAR(100), IN nuevo_apellido VARCHAR(100), IN nuevo_email VARCHAR(100), IN nuevo_telefono VARCHAR(15), IN nueva_fecha_nacimiento DATE, IN nuevo_id_grupo INT)
BEGIN
    UPDATE clientes SET nombre = nuevo_nombre, apellido = nuevo_apellido, email = nuevo_email, telefono = nuevo_telefono, fecha_nacimiento = nueva_fecha_nacimiento, id_grupo = nuevo_id_grupo WHERE id_cliente = id AND activo = 1;
END //

CREATE PROCEDURE eliminarCliente(IN id INT)
BEGIN
    UPDATE clientes SET activo = 0 WHERE id_cliente = id;
END //

-- Procedimientos para la tabla de pasaporte
CREATE PROCEDURE insertarPasaporte(IN id_cliente INT, IN numero VARCHAR(20), IN pais VARCHAR(100), IN fecha_expiracion DATE)
BEGIN
    INSERT INTO pasaporte (id_cliente, numero_pasaporte, pais_emision, fecha_expiracion) VALUES (id_cliente, numero, pais, fecha_expiracion);
END //

CREATE PROCEDURE obtenerPasaportesActivos()
BEGIN
    SELECT * FROM pasaporte WHERE activo = 1;
END //

CREATE PROCEDURE actualizarPasaporte(IN id INT, IN nuevo_id_cliente INT, IN nuevo_numero VARCHAR(20), IN nuevo_pais VARCHAR(100), IN nueva_fecha_expiracion DATE)
BEGIN
    UPDATE pasaporte SET id_cliente = nuevo_id_cliente, numero_pasaporte = nuevo_numero, pais_emision = nuevo_pais, fecha_expiracion = nueva_fecha_expiracion WHERE id_pasaporte = id AND activo = 1;
END //

CREATE PROCEDURE eliminarPasaporte(IN id INT)
BEGIN
    UPDATE pasaporte SET activo = 0 WHERE id_pasaporte = id;
END //

-- Procedimientos para la tabla de recomendaciones
CREATE PROCEDURE insertarRecomendacion(IN id_cliente INT, IN id_tour INT, IN contenido TEXT)
BEGIN
    INSERT INTO Recomendaciones (id_cliente, id_tour, contenido) VALUES (id_cliente, id_tour, contenido);
END //

CREATE PROCEDURE obtenerRecomendacionesActivas()
BEGIN
    SELECT * FROM Recomendaciones WHERE activo = 1;
END //

CREATE PROCEDURE actualizarRecomendacion(IN id INT, IN nuevo_id_cliente INT, IN nuevo_id_tour INT, IN nuevo_contenido TEXT)
BEGIN
    UPDATE Recomendaciones SET id_cliente = nuevo_id_cliente, id_tour = nuevo_id_tour, contenido = nuevo_contenido WHERE id_recomendacion = id AND activo = 1;
END //

CREATE PROCEDURE eliminarRecomendacion(IN id INT)
BEGIN
    UPDATE Recomendaciones SET activo = 0 WHERE id_recomendacion = id;
END //

-- Procedimientos para la tabla de reservas
CREATE PROCEDURE insertarReserva(IN id_cliente INT, IN id_tour INT, IN estado ENUM('pendiente', 'confirmada', 'cancelada'))
BEGIN
    INSERT INTO reservas (id_cliente, id_tour, estado) VALUES (id_cliente, id_tour, estado);
END //

CREATE PROCEDURE obtenerReservasActivas()
BEGIN
    SELECT * FROM reservas WHERE activo = 1;
END //

CREATE PROCEDURE actualizarReserva(IN id INT, IN nuevo_id_cliente INT, IN nuevo_id_tour INT, IN nuevo_estado ENUM('pendiente', 'confirmada', 'cancelada'))
BEGIN
    UPDATE reservas SET id_cliente = nuevo_id_cliente, id_tour = nuevo_id_tour, estado = nuevo_estado WHERE id_reserva = id AND activo = 1;
END //

CREATE PROCEDURE eliminarReserva(IN id INT)
BEGIN
    UPDATE reservas SET activo = 0 WHERE id_reserva = id;
END //

-- Procedimientos para la tabla de usuarios
CREATE PROCEDURE insertarUsuario(IN nombre VARCHAR(50), IN contraseña VARCHAR(255), IN rol ENUM('admin', 'asesor'))
BEGIN
    INSERT INTO usuarios (nombre, contraseña, rol) VALUES (nombre, contraseña, rol);
END //

CREATE PROCEDURE obtenerUsuariosActivos()
BEGIN
    SELECT * FROM usuarios WHERE activo = 1;
END //

CREATE PROCEDURE actualizarUsuario(IN id INT, IN nuevo_nombre VARCHAR(50), IN nueva_contraseña VARCHAR(255), IN nuevo_rol ENUM('admin', 'asesor'))
BEGIN
    UPDATE usuarios SET nombre = nuevo_nombre, contraseña = nueva_contraseña, rol = nuevo_rol WHERE id_usuario = id AND activo = 1;
END //

CREATE PROCEDURE eliminarUsuario(IN id INT)
BEGIN
    UPDATE usuarios SET activo = 0 WHERE id_usuario = id;
END //

DELIMITER ;

/*
INSERT INTO pdf (nombre_archivo, contenido) VALUES ('documento1.pdf', LOAD_FILE('/ruta/documento1.pdf'));
INSERT INTO pdf (nombre_archivo, contenido) VALUES ('documento2.pdf', LOAD_FILE('/ruta/documento2.pdf'));
INSERT INTO pdf (nombre_archivo, contenido) VALUES ('documento3.pdf', LOAD_FILE('/ruta/documento3.pdf'));
INSERT INTO pdf (nombre_archivo, contenido) VALUES ('documento4.pdf', LOAD_FILE('/ruta/documento4.pdf'));
INSERT INTO pdf (nombre_archivo, contenido) VALUES ('documento5.pdf', LOAD_FILE('/ruta/documento5.pdf'));

INSERT INTO tours (nombre_tour, descripcion, duracion, precio, categoria) VALUES ('Tour Aventura', 'Tour de aventura por el valle', 3, 150.00, 'Aventura');
INSERT INTO tours (nombre_tour, descripcion, duracion, precio, categoria) VALUES ('Tour Cultural', 'Tour por los sitios históricos', 2, 100.00, 'Cultural');
INSERT INTO tours (nombre_tour, descripcion, duracion, precio, categoria) VALUES ('Tour Gastronómico', 'Degustación de platos típicos', 1, 80.00, 'Gastronómico');
INSERT INTO tours (nombre_tour, descripcion, duracion, precio, categoria) VALUES ('Tour Ecológico', 'Exploración de la fauna local', 4, 200.00, 'Ecológico');
INSERT INTO tours (nombre_tour, descripcion, duracion, precio, categoria) VALUES ('Tour Nocturno', 'Recorrido nocturno de la ciudad', 1, 50.00, 'Nocturno');

INSERT INTO grupos (id_pdf, nombre_grupo) VALUES (1, 'Grupo Aventura 1');
INSERT INTO grupos (id_pdf, nombre_grupo) VALUES (2, 'Grupo Cultural 2');
INSERT INTO grupos (id_pdf, nombre_grupo) VALUES (3, 'Grupo Gastronómico 3');
INSERT INTO grupos (id_pdf, nombre_grupo) VALUES (4, 'Grupo Ecológico 4');
INSERT INTO grupos (id_pdf, nombre_grupo) VALUES (5, 'Grupo Nocturno 5');

INSERT INTO clientes (nombre, apellido, email, telefono, fecha_nacimiento, id_grupo) VALUES ('Juan', 'Perez', 'juan@example.com', '123456789', '1985-05-10', 1);
INSERT INTO clientes (nombre, apellido, email, telefono, fecha_nacimiento, id_grupo) VALUES ('Maria', 'Lopez', 'maria@example.com', '987654321', '1990-03-15', 2);
INSERT INTO clientes (nombre, apellido, email, telefono, fecha_nacimiento, id_grupo) VALUES ('Carlos', 'Garcia', 'carlos@example.com', '555123456', '1988-09-20', 3);
INSERT INTO clientes (nombre, apellido, email, telefono, fecha_nacimiento, id_grupo) VALUES ('Ana', 'Martinez', 'ana@example.com', '777888999', '1992-12-01', 4);
INSERT INTO clientes (nombre, apellido, email, telefono, fecha_nacimiento, id_grupo) VALUES ('Luis', 'Fernandez', 'luis@example.com', '444666777', '1980-07-22', 5);

INSERT INTO pasaporte (id_cliente, numero_pasaporte, pais_emision, fecha_expiracion) VALUES (1, 'X1234567', 'España', '2025-05-10');
INSERT INTO pasaporte (id_cliente, numero_pasaporte, pais_emision, fecha_expiracion) VALUES (2, 'Y7654321', 'México', '2024-08-20');
INSERT INTO pasaporte (id_cliente, numero_pasaporte, pais_emision, fecha_expiracion) VALUES (3, 'Z3456789', 'Argentina', '2023-11-30');
INSERT INTO pasaporte (id_cliente, numero_pasaporte, pais_emision, fecha_expiracion) VALUES (4, 'A9876543', 'Chile', '2026-02-14');
INSERT INTO pasaporte (id_cliente, numero_pasaporte, pais_emision, fecha_expiracion) VALUES (5, 'B2345678', 'Perú', '2027-07-19');

INSERT INTO Recomendaciones (id_cliente, id_tour, contenido) VALUES (1, 1, 'Recomendado por preferencias de aventura');
INSERT INTO Recomendaciones (id_cliente, id_tour, contenido) VALUES (2, 2, 'Recomendado por interés cultural');
INSERT INTO Recomendaciones (id_cliente, id_tour, contenido) VALUES (3, 3, 'Recomendado por gustos gastronómicos');
INSERT INTO Recomendaciones (id_cliente, id_tour, contenido) VALUES (4, 4, 'Recomendado por interés ecológico');
INSERT INTO Recomendaciones (id_cliente, id_tour, contenido) VALUES (5, 5, 'Recomendado por preferencia de tours nocturnos');

INSERT INTO reservas (id_cliente, id_tour, estado) VALUES (1, 1, 'pendiente');
INSERT INTO reservas (id_cliente, id_tour, estado) VALUES (2, 2, 'confirmada');
INSERT INTO reservas (id_cliente, id_tour, estado) VALUES (3, 3, 'cancelada');
INSERT INTO reservas (id_cliente, id_tour, estado) VALUES (4, 4, 'pendiente');
INSERT INTO reservas (id_cliente, id_tour, estado) VALUES (5, 5, 'confirmada');

INSERT INTO usuarios (nombre, contraseña, rol) VALUES ('admin1', 'contraseña1', 'admin');
INSERT INTO usuarios (nombre, contraseña, rol) VALUES ('asesor1', 'contraseña2', 'asesor');
INSERT INTO usuarios (nombre, contraseña, rol) VALUES ('asesor2', 'contraseña3', 'asesor');
INSERT INTO usuarios (nombre, contraseña, rol) VALUES ('admin2', 'contraseña4', 'admin');
INSERT INTO usuarios (nombre, contraseña, rol) VALUES ('asesor3', 'contraseña5', 'asesor');

20240912_COD_

pdf
tours
grupos
clientes
pasaporte
recomendaciones
reservas
usuarios
*/
