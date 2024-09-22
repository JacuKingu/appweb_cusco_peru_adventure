CREATE DATABASE cpa;
USE cpa;

-- Tabla de pdf con almacenamiento de contenido
CREATE TABLE pdf (
    id_pdf INT AUTO_INCREMENT PRIMARY KEY,
    archivo VARCHAR(255) NOT NULL,
    contenido LONGBLOB,
    creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo TINYINT(1) DEFAULT 1
);

-- Tabla de tours
CREATE TABLE tours (
    id_tour INT AUTO_INCREMENT PRIMARY KEY,
    tour VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion INT,
    precio DECIMAL(10, 2),
    categoria VARCHAR(50),
    activo TINYINT(1) DEFAULT 1
);

-- Tabla de Grupos de Viaje
CREATE TABLE grupos (
    id_grupo INT AUTO_INCREMENT PRIMARY KEY,
    id_pdf INT,
    grupo VARCHAR(100),
    creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo TINYINT(1) DEFAULT 1,
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
    creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    id_grupo INT,
    activo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (id_grupo) REFERENCES grupos(id_grupo)
);

-- Tabla de pasaporte
CREATE TABLE pasaporte (
    id_pasaporte INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    numero_pasaporte VARCHAR(20) UNIQUE NOT NULL,
    pais_emision VARCHAR(100),
    fecha_expiracion DATE,
    creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

-- Tabla de Recomendaciones
CREATE TABLE recomendaciones (
    id_recomendacion INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_tour INT,
    creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contenido TEXT,
    activo TINYINT(1) DEFAULT 1, 
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_tour) REFERENCES tours(id_tour)
);

-- Tabla de reservas
CREATE TABLE reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_tour INT,
    creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'confirmada', 'cancelada') DEFAULT 'pendiente',
    activo TINYINT(1) DEFAULT 1, 
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_tour) REFERENCES tours(id_tour)
);

-- Tabla de Usuarios Administrativos
CREATE TABLE usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'asesor') DEFAULT 'asesor',
    creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo TINYINT(1) DEFAULT 1 
);

DELIMITER //

-- Procedimientos para la tabla de pdf
CREATE PROCEDURE insertarPdf(IN nombre VARCHAR(255), IN contenido BLOB)
BEGIN
    INSERT INTO pdf (archivo, contenido) VALUES (nombre, contenido);
END //

CREATE PROCEDURE obtenerPdfsActivos(IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM pdf WHERE activo = 1;
    ELSE
        SELECT * FROM pdf;
    END IF;
END //

CREATE PROCEDURE obtenerPdfPorId(IN id INT, IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM pdf WHERE id_pdf = id AND activo = 1;
    ELSE
        SELECT * FROM pdf WHERE id_pdf = id;
    END IF;
END //

CREATE PROCEDURE actualizarPdf(IN id INT, IN nuevo_nombre VARCHAR(255), IN nuevo_contenido BLOB)
BEGIN
    UPDATE pdf SET archivo = nuevo_nombre, contenido = nuevo_contenido WHERE id_pdf = id AND activo = 1;
END //

CREATE PROCEDURE eliminarPdf(IN id INT)
BEGIN
    UPDATE pdf SET activo = 0 WHERE id_pdf = id;
END //

-- Procedimientos para la tabla de tours
CREATE PROCEDURE insertarTour(IN nombre VARCHAR(100), IN descripcion TEXT, IN duracion INT, IN precio DECIMAL(10, 2), IN categoria VARCHAR(50))
BEGIN
    INSERT INTO tours (tour, descripcion, duracion, precio, categoria) VALUES (nombre, descripcion, duracion, precio, categoria);
END //

CREATE PROCEDURE obtenerToursActivos(IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM tours WHERE activo = 1;
    ELSE
        SELECT * FROM tours;
    END IF;
END //

CREATE PROCEDURE obtenerTourPorId(IN id INT, IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM tours WHERE id_tour = id AND activo = 1;
    ELSE
        SELECT * FROM tours WHERE id_tour = id;
    END IF;
END //

CREATE PROCEDURE actualizarTour(IN id INT, IN nuevo_nombre VARCHAR(100), IN nueva_descripcion TEXT, IN nueva_duracion INT, IN nuevo_precio DECIMAL(10, 2), IN nueva_categoria VARCHAR(50))
BEGIN
    UPDATE tours SET tour = nuevo_nombre, descripcion = nueva_descripcion, duracion = nueva_duracion, precio = nuevo_precio, categoria = nueva_categoria WHERE id_tour = id AND activo = 1;
END //

CREATE PROCEDURE eliminarTour(IN id INT)
BEGIN
    UPDATE tours SET activo = 0 WHERE id_tour = id;
END //

-- Procedimientos para la tabla de grupos
CREATE PROCEDURE insertarGrupo(IN id_pdf INT, IN nombre VARCHAR(100))
BEGIN
    INSERT INTO grupos (id_pdf, grupo) VALUES (id_pdf, nombre);
END //

CREATE PROCEDURE obtenerGruposActivos(IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM grupos WHERE activo = 1;
    ELSE
        SELECT * FROM grupos;
    END IF;
END //

CREATE PROCEDURE obtenerGrupoPorId(IN id INT, IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM grupos WHERE id_grupo = id AND activo = 1;
    ELSE
        SELECT * FROM grupos WHERE id_grupo = id;
    END IF;
END //

CREATE PROCEDURE actualizarGrupo(IN id INT, IN nuevo_id_pdf INT, IN nuevo_nombre VARCHAR(100))
BEGIN
    UPDATE grupos SET id_pdf = nuevo_id_pdf, grupo = nuevo_nombre WHERE id_grupo = id AND activo = 1;
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

CREATE PROCEDURE obtenerClientesActivos(IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM clientes WHERE activo = 1;
    ELSE
        SELECT * FROM clientes;
    END IF;
END //

CREATE PROCEDURE obtenerClientePorId(IN id INT, IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM clientes WHERE id_cliente = id AND activo = 1;
    ELSE
        SELECT * FROM clientes WHERE id_cliente = id;
    END IF;
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

CREATE PROCEDURE obtenerPasaportesActivos(IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM pasaporte WHERE activo = 1;
    ELSE
        SELECT * FROM pasaporte;
    END IF;
END //

CREATE PROCEDURE obtenerPasaportePorId(IN id INT, IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM pasaporte WHERE id_pasaporte = id AND activo = 1;
    ELSE
        SELECT * FROM pasaporte WHERE id_pasaporte = id;
    END IF;
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
    INSERT INTO recomendaciones (id_cliente, id_tour, contenido) VALUES (id_cliente, id_tour, contenido);
END //

CREATE PROCEDURE obtenerRecomendacionesActivas(IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM recomendaciones WHERE activo = 1;
    ELSE
        SELECT * FROM recomendaciones;
    END IF;
END //

CREATE PROCEDURE obtenerRecomendacionPorId(IN id INT, IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM recomendaciones WHERE id_recomendacion = id AND activo = 1;
    ELSE
        SELECT * FROM recomendaciones WHERE id_recomendacion = id;
    END IF;
END //

CREATE PROCEDURE actualizarRecomendacion(IN id INT, IN nuevo_id_cliente INT, IN nuevo_id_tour INT, IN nuevo_contenido TEXT)
BEGIN
    UPDATE recomendaciones SET id_cliente = nuevo_id_cliente, id_tour = nuevo_id_tour, contenido = nuevo_contenido WHERE id_recomendacion = id AND activo = 1;
END //

CREATE PROCEDURE eliminarRecomendacion(IN id INT)
BEGIN
    UPDATE recomendaciones SET activo = 0 WHERE id_recomendacion = id;
END //

-- Procedimientos para la tabla de reservas
CREATE PROCEDURE insertarReserva(IN id_cliente INT, IN id_tour INT, IN estado ENUM('pendiente', 'confirmada', 'cancelada'))
BEGIN
    INSERT INTO reservas (id_cliente, id_tour, estado) VALUES (id_cliente, id_tour, estado);
END //

CREATE PROCEDURE obtenerReservasActivas(IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM reservas WHERE activo = 1;
    ELSE
        SELECT * FROM reservas;
    END IF;
END //

CREATE PROCEDURE obtenerReservaPorId(IN id INT, IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM reservas WHERE id_reserva = id AND activo = 1;
    ELSE
        SELECT * FROM reservas WHERE id_reserva = id;
    END IF;
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

CREATE PROCEDURE obtenerUsuariosActivos(IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM usuarios WHERE activo = 1;
    ELSE
        SELECT * FROM usuarios;
    END IF;
END //

CREATE PROCEDURE obtenerUsuarioPorId(IN id INT, IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM usuarios WHERE id_usuario = id AND activo = 1;
    ELSE
        SELECT * FROM usuarios WHERE id_usuario = id;
    END IF;
END //

CREATE PROCEDURE actualizarUsuario(IN id INT, IN nuevo_nombre VARCHAR(50), IN nueva_contraseña VARCHAR(255), IN nuevo_rol ENUM('admin', 'asesor'))
BEGIN
    UPDATE usuarios SET nombre = nuevo_nombre, contraseña = nueva_contraseña, rol = nuevo_rol WHERE id_usuario = id AND activo = 1;
END //

CREATE PROCEDURE eliminarUsuario(IN id INT)
BEGIN
    UPDATE usuarios SET activo = 0 WHERE id_usuario = id;
END //

CREATE PROCEDURE loginUsuario(
    IN nombre_usuario VARCHAR(50),
    OUT mensaje VARCHAR(255),
    OUT rol_usuario ENUM('admin', 'asesor'),
    OUT id_usuario INT,
    OUT contraseña_hash VARCHAR(255)
)
BEGIN
    DECLARE usuario_existe INT DEFAULT 0;
    DECLARE usuario_activo TINYINT(1);

    -- Verificar si el usuario existe y obtener el valor de activo
    SELECT COUNT(*), activo 
    INTO usuario_existe, usuario_activo 
    FROM usuarios 
    WHERE nombre = nombre_usuario;

    IF usuario_existe = 0 THEN
        -- Si el usuario no existe, establecer mensaje
        SET mensaje = 'Usuario no encontrado o no tienes permiso para verlo';
        SET rol_usuario = NULL;
        SET id_usuario = NULL;
        SET contraseña_hash = NULL;
    ELSEIF usuario_activo = 0 THEN
        -- Si el usuario existe pero no está activado, establecer mensaje
        SET mensaje = 'Usuario no activado';
        SET rol_usuario = NULL;
        SET id_usuario = NULL;
        SET contraseña_hash = NULL;
    ELSE
        -- Si el usuario existe y está activo, obtener sus datos
        SELECT id_usuario, rol, contraseña 
        INTO id_usuario, rol_usuario, contraseña_hash
        FROM usuarios 
        WHERE nombre = nombre_usuario;

        -- Establecer el mensaje de éxito
        SET mensaje = 'Usuario encontrado. Contraseña verificada externamente.';
    END IF;
END //

CREATE PROCEDURE signupUsuario(
    IN nombre_usuario VARCHAR(50),
    IN contraseña_usuario VARCHAR(255), -- Contraseña encriptada
    IN rol_usuario ENUM('admin', 'asesor'),
    OUT mensaje VARCHAR(255)
)
BEGIN
    DECLARE duplicado INT DEFAULT 0;

    -- Verificar si el nombre de usuario ya existe
    SELECT COUNT(*) INTO duplicado 
    FROM usuarios 
    WHERE nombre = nombre_usuario;

    IF duplicado > 0 THEN
        SET mensaje = 'El nombre de usuario ya está en uso. Por favor, elige otro.';
    ELSE
        -- Insertar el nuevo usuario con activo = 0
        INSERT INTO usuarios (nombre, contraseña, rol, activo) 
        VALUES (nombre_usuario, contraseña_usuario, rol_usuario, 1);

        SET mensaje = 'Registro exitoso. La cuenta ha sido creada.';
    END IF;
END //

DELIMITER ;


/* 
-- Tabla tours
INSERT INTO tours (tour, descripcion, duracion, precio, categoria) VALUES ('Tour Histórico', 'Explora la historia de la ciudad.', 3, 50.00, 'Cultural');
INSERT INTO tours (tour, descripcion, duracion, precio, categoria) VALUES ('Aventura en la Montaña', 'Senderismo y escalada.', 5, 120.00, 'Aventura');
INSERT INTO tours (tour, descripcion, duracion, precio, categoria) VALUES ('Tour Gastronómico', 'Degustación de comida local.', 2, 35.00, 'Gastronomía');

-- Tabla grupos
INSERT INTO grupos (id_pdf, grupo) VALUES (1, 'Grupo Histórico');
INSERT INTO grupos (id_pdf, grupo) VALUES (2, 'Grupo Aventura');
INSERT INTO grupos (id_pdf, grupo) VALUES (3, 'Grupo Gastronómico');

-- Tabla clientes
INSERT INTO clientes (nombre, apellido, email, telefono, fecha_nacimiento, id_grupo) VALUES ('Juan', 'Pérez', 'juan.perez@example.com', '123456789', '1990-05-10', 1);
INSERT INTO clientes (nombre, apellido, email, telefono, fecha_nacimiento, id_grupo) VALUES ('Ana', 'Gómez', 'ana.gomez@example.com', '987654321', '1985-03-22', 2);
INSERT INTO clientes (nombre, apellido, email, telefono, fecha_nacimiento, id_grupo) VALUES ('Carlos', 'Martínez', 'carlos.martinez@example.com', '555123456', '1992-12-15', 3);

-- Tabla pasaporte
INSERT INTO pasaporte (id_cliente, numero_pasaporte, pais_emision, fecha_expiracion) VALUES (1, 'P12345678', 'México', '2030-01-01');
INSERT INTO pasaporte (id_cliente, numero_pasaporte, pais_emision, fecha_expiracion) VALUES (2, 'G87654321', 'Argentina', '2028-05-10');
INSERT INTO pasaporte (id_cliente, numero_pasaporte, pais_emision, fecha_expiracion) VALUES (3, 'M09876543', 'Colombia', '2029-11-25');

-- Tabla recomendaciones
INSERT INTO recomendaciones (id_cliente, id_tour, contenido) VALUES (1, 1, 'El tour fue muy informativo y entretenido.');
INSERT INTO recomendaciones (id_cliente, id_tour, contenido) VALUES (2, 2, 'La aventura en la montaña fue desafiante pero gratificante.');
INSERT INTO recomendaciones (id_cliente, id_tour, contenido) VALUES (3, 3, 'Deliciosa experiencia gastronómica, lo recomiendo.');

-- Tabla reservas
INSERT INTO reservas (id_cliente, id_tour, estado) VALUES (1, 1, 'confirmada');
INSERT INTO reservas (id_cliente, id_tour, estado) VALUES (2, 2, 'pendiente');
INSERT INTO reservas (id_cliente, id_tour, estado) VALUES (3, 3, 'cancelada');

-- Tabla usuarios
INSERT INTO usuarios (nombre, contraseña, rol) VALUES ('admin1', 'password123', 'admin');
INSERT INTO usuarios (nombre, contraseña, rol) VALUES ('asesor1', 'password123', 'asesor');
INSERT INTO usuarios (nombre, contraseña, rol) VALUES ('asesor2', 'password456', 'asesor');

--------------------------------------------------------------------------------------------------
Tabla tours

{ "tour": "Tour Histórico", "descripcion": "Explora la historia de la ciudad.", "duracion": 3, "precio": 50.00, "categoria": "Cultural" }
{ "tour": "Aventura en la Montaña", "descripcion": "Senderismo y escalada.", "duracion": 5, "precio": 120.00, "categoria": "Aventura" }
{ "tour": "Tour Gastronómico", "descripcion": "Degustación de comida local.", "duracion": 2, "precio": 35.00, "categoria": "Gastronomía" }
Tabla grupos

{ "id_pdf": 1, "grupo": "Grupo Histórico" }
{ "id_pdf": 2, "grupo": "Grupo Aventura" }
{ "id_pdf": 3, "grupo": "Grupo Gastronómico" }

Tabla clientes

{ "nombre": "Juan", "apellido": "Pérez", "email": "juan.perez@example.com", "telefono": "123456789", "fecha_nacimiento": "1990-05-10", "id_grupo": 1 }
{ "nombre": "Ana", "apellido": "Gómez", "email": "ana.gomez@example.com", "telefono": "987654321", "fecha_nacimiento": "1985-03-22", "id_grupo": 2 }
{ "nombre": "Carlos", "apellido": "Martínez", "email": "carlos.martinez@example.com", "telefono": "555123456", "fecha_nacimiento": "1992-12-15", "id_grupo": 3 }

Tabla pasaporte

{ "id_cliente": 1, "numero_pasaporte": "P12345678", "pais_emision": "México", "fecha_expiracion": "2030-01-01" }
{ "id_cliente": 2, "numero_pasaporte": "G87654321", "pais_emision": "Argentina", "fecha_expiracion": "2028-05-10" }
{ "id_cliente": 3, "numero_pasaporte": "M09876543", "pais_emision": "Colombia", "fecha_expiracion": "2029-11-25" }

Tabla recomendaciones

{ "id_cliente": 1, "id_tour": 1, "contenido": "El tour fue muy informativo y entretenido." }
{ "id_cliente": 2, "id_tour": 2, "contenido": "La aventura en la montaña fue desafiante pero gratificante." }
{ "id_cliente": 3, "id_tour": 3, "contenido": "Deliciosa experiencia gastronómica, lo recomiendo." }

Tabla reservas

{ "id_cliente": 1, "id_tour": 1, "estado": "confirmada" }
{ "id_cliente": 2, "id_tour": 2, "estado": "pendiente" }
{ "id_cliente": 3, "id_tour": 3, "estado": "cancelada" }

Tabla usuarios

{ "nombre": "admin1", "contraseña": "password123", "rol": "admin" }
{ "nombre": "asesor1", "contraseña": "password123", "rol": "asesor" }
{ "nombre": "asesor2", "contraseña": "password456", "rol": "asesor" }

 */