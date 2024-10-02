CREATE TABLE IF NOT EXISTS pdf (
    id_pdf INT AUTO_INCREMENT PRIMARY KEY,
    archivo VARCHAR(255) NOT NULL,
    contenido LONGBLOB,
    creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo TINYINT(1) DEFAULT 1
);

CREATE TABLE IF NOT EXISTS tours (
    id_tour INT AUTO_INCREMENT PRIMARY KEY,
    tour VARCHAR(100) NOT NULL,
    descripcion TEXT,
    duracion INT,
    precio DECIMAL(10, 2),
    categoria VARCHAR(50),
    activo TINYINT(1) DEFAULT 1
);

CREATE TABLE IF NOT EXISTS grupos (
    id_grupo INT AUTO_INCREMENT PRIMARY KEY,
    id_pdf INT,
    grupo VARCHAR(100),
    creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (id_pdf) REFERENCES pdf(id_pdf)
);

CREATE TABLE IF NOT EXISTS clientes (
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

CREATE TABLE IF NOT EXISTS pasaporte (
    id_pasaporte INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    numero_pasaporte VARCHAR(20) UNIQUE NOT NULL,
    pais_emision VARCHAR(100),
    fecha_expiracion DATE,
    creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo TINYINT(1) DEFAULT 1,
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente)
);

CREATE TABLE IF NOT EXISTS recomendaciones (
    id_recomendacion INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_tour INT,
    creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    contenido TEXT,
    activo TINYINT(1) DEFAULT 1, 
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_tour) REFERENCES tours(id_tour)
);

CREATE TABLE IF NOT EXISTS reservas (
    id_reserva INT AUTO_INCREMENT PRIMARY KEY,
    id_cliente INT,
    id_tour INT,
    creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    estado ENUM('pendiente', 'confirmada', 'cancelada') DEFAULT 'pendiente',
    activo TINYINT(1) DEFAULT 1, 
    FOREIGN KEY (id_cliente) REFERENCES clientes(id_cliente),
    FOREIGN KEY (id_tour) REFERENCES tours(id_tour)
);

CREATE TABLE IF NOT EXISTS usuarios (
    id_usuario INT AUTO_INCREMENT PRIMARY KEY,
    nombre VARCHAR(50) UNIQUE NOT NULL,
    contraseña VARCHAR(255) NOT NULL,
    rol ENUM('admin', 'asesor') DEFAULT 'asesor',
    creacion TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    activo TINYINT(1) DEFAULT 1 
);

-- Procedimientos para la tabla de pdf
DROP PROCEDURE IF EXISTS insertarPdf;
CREATE PROCEDURE insertarPdf(IN nombre VARCHAR(255), IN contenido LONGBLOB)
BEGIN
    INSERT INTO pdf (archivo, contenido) VALUES (nombre, contenido);
END;

DROP PROCEDURE IF EXISTS obtenerPdfsActivos;
CREATE PROCEDURE obtenerPdfsActivos(IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM pdf WHERE activo = 1;
    ELSE
        SELECT * FROM pdf;
    END IF;
END;

DROP PROCEDURE IF EXISTS obtenerPdfPorId;
CREATE PROCEDURE obtenerPdfPorId(IN id INT, IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM pdf WHERE id_pdf = id AND activo = 1;
    ELSE
        SELECT * FROM pdf WHERE id_pdf = id;
    END IF;
END;

DROP PROCEDURE IF EXISTS eliminarPdf;
CREATE PROCEDURE eliminarPdf(IN id INT)
BEGIN
    UPDATE pdf SET activo = 0 WHERE id_pdf = id;
END;

-- Procedimientos para la tabla de tours
DROP PROCEDURE IF EXISTS insertarTour;
CREATE PROCEDURE insertarTour(IN nombre VARCHAR(100), IN descripcion TEXT, IN duracion INT, IN precio DECIMAL(10, 2), IN categoria VARCHAR(50))
BEGIN
    INSERT INTO tours (tour, descripcion, duracion, precio, categoria) VALUES (nombre, descripcion, duracion, precio, categoria);
END;

DROP PROCEDURE IF EXISTS obtenerToursActivos;
CREATE PROCEDURE obtenerToursActivos(IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM tours WHERE activo = 1;
    ELSE
        SELECT * FROM tours;
    END IF;
END;

DROP PROCEDURE IF EXISTS obtenerTourPorId;
CREATE PROCEDURE obtenerTourPorId(IN id INT, IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM tours WHERE id_tour = id AND activo = 1;
    ELSE
        SELECT * FROM tours WHERE id_tour = id;
    END IF;
END;

DROP PROCEDURE IF EXISTS actualizarTour;
CREATE PROCEDURE actualizarTour(IN id INT, IN nuevo_nombre VARCHAR(100), IN nueva_descripcion TEXT, IN nueva_duracion INT, IN nuevo_precio DECIMAL(10, 2), IN nueva_categoria VARCHAR(50))
BEGIN
    UPDATE tours SET tour = nuevo_nombre, descripcion = nueva_descripcion, duracion = nueva_duracion, precio = nuevo_precio, categoria = nueva_categoria WHERE id_tour = id AND activo = 1;
END;

DROP PROCEDURE IF EXISTS eliminarTour;
CREATE PROCEDURE eliminarTour(IN id INT)
BEGIN
    UPDATE tours SET activo = 0 WHERE id_tour = id;
END;

-- Procedimientos para la tabla de grupos
DROP PROCEDURE IF EXISTS insertarGrupo;
CREATE PROCEDURE insertarGrupo(IN id_pdf INT, IN nombre VARCHAR(100))
BEGIN
    INSERT INTO grupos (id_pdf, grupo) VALUES (id_pdf, nombre);
END;

DROP PROCEDURE IF EXISTS insertarUltimoGrupo;
CREATE PROCEDURE insertarUltimoGrupo(IN id_pdf INT, IN nombre_grupo VARCHAR(100))
BEGIN
    INSERT INTO grupos (id_pdf, grupo)
    VALUES (id_pdf, nombre_grupo);
    SELECT LAST_INSERT_ID() AS id_grupo;
END;


DROP PROCEDURE IF EXISTS obtenerGruposActivos;
CREATE PROCEDURE obtenerGruposActivos(IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM grupos WHERE activo = 1;
    ELSE
        SELECT * FROM grupos;
    END IF;
END;

DROP PROCEDURE IF EXISTS obtenerGrupoPorId;
CREATE PROCEDURE obtenerGrupoPorId(IN id INT, IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM grupos WHERE id_grupo = id AND activo = 1;
    ELSE
        SELECT * FROM grupos WHERE id_grupo = id;
    END IF;
END;

DROP PROCEDURE IF EXISTS actualizarGrupo;
CREATE PROCEDURE actualizarGrupo(IN id INT, IN nuevo_id_pdf INT, IN nuevo_nombre VARCHAR(100))
BEGIN
    UPDATE grupos SET id_pdf = nuevo_id_pdf, grupo = nuevo_nombre WHERE id_grupo = id AND activo = 1;
END;

DROP PROCEDURE IF EXISTS eliminarGrupo;
CREATE PROCEDURE eliminarGrupo(IN id INT)
BEGIN
    UPDATE grupos SET activo = 0 WHERE id_grupo = id;
END;

-- Procedimientos para la tabla de clientes
DROP PROCEDURE IF EXISTS insertarCliente;
CREATE PROCEDURE insertarCliente(IN nombre VARCHAR(100), IN apellido VARCHAR(100), IN email VARCHAR(100), IN telefono VARCHAR(15), IN fecha_nacimiento DATE, IN id_grupo INT)
BEGIN
    INSERT INTO clientes (nombre, apellido, email, telefono, fecha_nacimiento, id_grupo) VALUES (nombre, apellido, email, telefono, fecha_nacimiento, id_grupo);
END;

DROP PROCEDURE IF EXISTS obtenerClientesActivos;
CREATE PROCEDURE obtenerClientesActivos(IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM clientes WHERE activo = 1;
    ELSE
        SELECT * FROM clientes;
    END IF;
END;

DROP PROCEDURE IF EXISTS obtenerClientePorId;
CREATE PROCEDURE obtenerClientePorId(IN id INT, IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM clientes WHERE id_cliente = id AND activo = 1;
    ELSE
        SELECT * FROM clientes WHERE id_cliente = id;
    END IF;
END;

DROP PROCEDURE IF EXISTS actualizarCliente;
CREATE PROCEDURE actualizarCliente(IN id INT, IN nuevo_nombre VARCHAR(100), IN nuevo_apellido VARCHAR(100), IN nuevo_email VARCHAR(100), IN nuevo_telefono VARCHAR(15), IN nueva_fecha_nacimiento DATE, IN nuevo_id_grupo INT)
BEGIN
    UPDATE clientes SET nombre = nuevo_nombre, apellido = nuevo_apellido, email = nuevo_email, telefono = nuevo_telefono, fecha_nacimiento = nueva_fecha_nacimiento, id_grupo = nuevo_id_grupo WHERE id_cliente = id AND activo = 1;
END;

DROP PROCEDURE IF EXISTS eliminarCliente;
CREATE PROCEDURE eliminarCliente(IN id INT)
BEGIN
    UPDATE clientes SET activo = 0 WHERE id_cliente = id;
END;

-- Procedimientos para la tabla de pasaporte
DROP PROCEDURE IF EXISTS insertarPasaporte;
CREATE PROCEDURE insertarPasaporte(IN id_cliente INT, IN numero VARCHAR(20), IN pais VARCHAR(100), IN fecha_expiracion DATE)
BEGIN
    INSERT INTO pasaporte (id_cliente, numero_pasaporte, pais_emision, fecha_expiracion) VALUES (id_cliente, numero, pais, fecha_expiracion);
END;

DROP PROCEDURE IF EXISTS obtenerPasaportesActivos;
CREATE PROCEDURE obtenerPasaportesActivos(IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM pasaporte WHERE activo = 1;
    ELSE
        SELECT * FROM pasaporte;
    END IF;
END;

DROP PROCEDURE IF EXISTS obtenerPasaportePorId;
CREATE PROCEDURE obtenerPasaportePorId(IN id INT, IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM pasaporte WHERE id_pasaporte = id AND activo = 1;
    ELSE
        SELECT * FROM pasaporte WHERE id_pasaporte = id;
    END IF;
END;

DROP PROCEDURE IF EXISTS actualizarPasaporte;
CREATE PROCEDURE actualizarPasaporte(IN id INT, IN nuevo_id_cliente INT, IN nuevo_numero VARCHAR(20), IN nuevo_pais VARCHAR(100), IN nueva_fecha_expiracion DATE)
BEGIN
    UPDATE pasaporte SET id_cliente = nuevo_id_cliente, numero_pasaporte = nuevo_numero, pais_emision = nuevo_pais, fecha_expiracion = nueva_fecha_expiracion WHERE id_pasaporte = id AND activo = 1;
END;

DROP PROCEDURE IF EXISTS eliminarPasaporte;
CREATE PROCEDURE eliminarPasaporte(IN id INT)
BEGIN
    UPDATE pasaporte SET activo = 0 WHERE id_pasaporte = id;
END;

-- Procedimientos para la tabla de recomendaciones
DROP PROCEDURE IF EXISTS insertarRecomendacion;
CREATE PROCEDURE insertarRecomendacion(IN id_cliente INT, IN id_tour INT, IN contenido TEXT)
BEGIN
    INSERT INTO recomendaciones (id_cliente, id_tour, contenido) VALUES (id_cliente, id_tour, contenido);
END;

DROP PROCEDURE IF EXISTS obtenerRecomendacionesActivas;
CREATE PROCEDURE obtenerRecomendacionesActivas(IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM recomendaciones WHERE activo = 1;
    ELSE
        SELECT * FROM recomendaciones;
    END IF;
END;

DROP PROCEDURE IF EXISTS obtenerRecomendacionPorId;
CREATE PROCEDURE obtenerRecomendacionPorId(IN id INT, IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM recomendaciones WHERE id_recomendacion = id AND activo = 1;
    ELSE
        SELECT * FROM recomendaciones WHERE id_recomendacion = id;
    END IF;
END;

DROP PROCEDURE IF EXISTS actualizarRecomendacion;
CREATE PROCEDURE actualizarRecomendacion(IN id INT, IN nuevo_id_cliente INT, IN nuevo_id_tour INT, IN nuevo_contenido TEXT)
BEGIN
    UPDATE recomendaciones SET id_cliente = nuevo_id_cliente, id_tour = nuevo_id_tour, contenido = nuevo_contenido WHERE id_recomendacion = id AND activo = 1;
END;

DROP PROCEDURE IF EXISTS eliminarRecomendacion;
CREATE PROCEDURE eliminarRecomendacion(IN id INT)
BEGIN
    UPDATE recomendaciones SET activo = 0 WHERE id_recomendacion = id;
END;

-- Procedimientos para la tabla de reservas
DROP PROCEDURE IF EXISTS insertarReserva;
CREATE PROCEDURE insertarReserva(IN id_cliente INT, IN id_tour INT, IN estado ENUM('pendiente', 'confirmada', 'cancelada'))
BEGIN
    INSERT INTO reservas (id_cliente, id_tour, estado) VALUES (id_cliente, id_tour, estado);
END;

DROP PROCEDURE IF EXISTS obtenerReservasActivas;
CREATE PROCEDURE obtenerReservasActivas(IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM reservas WHERE activo = 1;
    ELSE
        SELECT * FROM reservas;
    END IF;
END;

DROP PROCEDURE IF EXISTS obtenerReservaPorId;
CREATE PROCEDURE obtenerReservaPorId(IN id INT, IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM reservas WHERE id_reserva = id AND activo = 1;
    ELSE
        SELECT * FROM reservas WHERE id_reserva = id;
    END IF;
END;

DROP PROCEDURE IF EXISTS actualizarReserva;
CREATE PROCEDURE actualizarReserva(IN id INT, IN nuevo_id_cliente INT, IN nuevo_id_tour INT, IN nuevo_estado ENUM('pendiente', 'confirmada', 'cancelada'))
BEGIN
    UPDATE reservas SET id_cliente = nuevo_id_cliente, id_tour = nuevo_id_tour, estado = nuevo_estado WHERE id_reserva = id AND activo = 1;
END;

DROP PROCEDURE IF EXISTS eliminarReserva;
CREATE PROCEDURE eliminarReserva(IN id INT)
BEGIN
    UPDATE reservas SET activo = 0 WHERE id_reserva = id;
END;

-- Procedimientos para la tabla de usuarios
DROP PROCEDURE IF EXISTS insertarUsuario;
CREATE PROCEDURE insertarUsuario(IN nombre VARCHAR(50), IN contraseña VARCHAR(255), IN rol ENUM('admin', 'asesor'))
BEGIN
    INSERT INTO usuarios (nombre, contraseña, rol) VALUES (nombre, contraseña, rol);
END;

DROP PROCEDURE IF EXISTS obtenerUsuariosActivos;
CREATE PROCEDURE obtenerUsuariosActivos(IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM usuarios WHERE activo = 1;
    ELSE
        SELECT * FROM usuarios;
    END IF;
END;

DROP PROCEDURE IF EXISTS obtenerUsuarioPorId;
CREATE PROCEDURE obtenerUsuarioPorId(IN id INT, IN rol ENUM('admin', 'asesor'))
BEGIN
    IF rol = 'asesor' THEN
        SELECT * FROM usuarios WHERE id_usuario = id AND activo = 1;
    ELSE
        SELECT * FROM usuarios WHERE id_usuario = id;
    END IF;
END;

DROP PROCEDURE IF EXISTS actualizarUsuario;
CREATE PROCEDURE actualizarUsuario(IN id INT, IN nuevo_nombre VARCHAR(50), IN nueva_contraseña VARCHAR(255), IN nuevo_rol ENUM('admin', 'asesor'))
BEGIN
    UPDATE usuarios SET nombre = nuevo_nombre, contraseña = nueva_contraseña, rol = nuevo_rol WHERE id_usuario = id AND activo = 1;
END;

DROP PROCEDURE IF EXISTS eliminarUsuario;
CREATE PROCEDURE eliminarUsuario(IN id INT)
BEGIN
    UPDATE usuarios SET activo = 0 WHERE id_usuario = id;
END;

DROP PROCEDURE IF EXISTS loginUsuario;
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
END;

DROP PROCEDURE IF EXISTS signupUsuario;
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
END;

INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Machupicchu | Full Day todo inlcuido con tren Turístico de Perú Rail o Inca Rail', 'recojo de hotel viaje en bus aprox 1 hora con 30 minutos, subir al tren viaje de 2 horas, abordar bus turistico de macupicchu pueblo a machu picchu viaje de 30 minutos, en machupicchu se recorrera todo los principales sitios turisticos en compañia del guia, tendran tiempo de tomarse fotos, se tomara el bus de retorno a machu picchu pueblo donde se almorzara luego tomaran el tren de regreso a Cusco. 

Incluye todo

275 en tren Expedition
375 en tren Vita Dome', 24, 275, 'Caminata', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Machu Picchu by Car | Ruta Amazónica En Bus, Hidroeléctrica', 'Dia1: recojo de hotel 6:20 am, pasaran por chinchero, el valle sagrado, olantaytambo con una parada para relajarse y comprar algo, pasaran por Habrá de Málaga que esta a 4.316 metros sobre el nivel del mar, descenso a la selva alta hazta el pueblo de Santa Maria, se descansara, se continuara el viaje hazta el pueblo de Santa Teresa, se almorzara, a las 3 pm se inica la caminata de 2 horas con 40 minutos a Machu Picchu pueblo, se llegara al hospedaje 8 pm para cenar y dormir.
Dia2: se levantan temprano para tomar el bus de machu picchu pueblo a machupicchu, se conocera machupicchu hazta las 11:30 am, se descendera en bus o caminando a machu picchu pueblo, se tomara tren de machu picchu pueblo a la central de hidroeléctrica a las 12:35 pm, tomamos el tranporte de retorno a la ciudad del cusco, se llegara 9:45 pm

Notas: El alojamiento estará basado en habitaciones dobles.

No incluye: 
Tren desde la Hidroeléctrica hasta Aguas Calientes, y viceversa.
Entrada a los baños termales de Aguas Calientes.
Bus de subida o bajada desde Aguas Calientes – Machu Picchu.
Alimentación después de visitar Machu Picchu.
Seguro de Viaje, recomendable durante su viaje (contratarlo desde su país).', 57, 120, 'Caminata', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Tour Cuatrimotos Maras Moray | Moray, Salineras de Maras, Terrazas Incas de Zurite, Huarocondo y Laguna de Huaypo en Tour Exclusivo Privado', 'Recojo de hotel, viaje de 45 minutoas a la oficina en Anta, se le brinda toda la informacion y recomendaciones, practica en las cuatrimotoas, se diregen en cuatrimotos a las terrazas incas de Zurite, se dirigen al pueblo de Huarocondo, se camina por le purblo de Huaroncondo, se dirigen a Moray pasando por los pueblos de Anta y Maras, se dirigiran a Misminay y se almorzara ahi, se dirigiran a las minas de sal y moray, se dirigiran a la laguna de Huaypo, se dirigiran a la base en Anta, total se viajo 64 kilometros, el transporte les llevara a su hotel.

No incluye:
Entradas a Moray (70 soles) y Salineras (20 soles)
Cualquier Seguro personal o de accidente', 24, 177, 'Aventura', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Tours en Cuatrimotos | Tour en Cuatrimoto Killarumiyoq | más los andenes Incas de Zurite, Qente Qenteyoc y el Pueblo Colonial de Zurite en un Tour Privado Exclusivo', 'Recojo en hotel, viaje de 55 minutos a la oficina en Anta, se brinda información sobre el tour, se conduce por la pampa de anta a las Terrazas Incas de Zurite donde se preservan semillas nativas, se visita Qente Qenteyoc sitio espiritual dedicado al colibrí, se visita el templo de la luna Killarumiyoq, en el camino de regreso nos detendremos en el pueblo colonial de Zurite para caminar y tomar fotos, se llega a la oficina de Anta  para regresar a nuestro hotel, se recorren 45 kilómetros en cuatrimoto. 

No incluye:
Entradas a Killarumiyoq (10 soles)
Cualquier seguro personal o de accidentes', 12, 85, 'Aventura', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Tour Cuatrimotos Laguna Huaypo | Terrazas Incas de Zurite, Pueblo Colonial de Huarocondo y Hermosas Comunidades Andinas en un Tour Exclusivo Privado', 'Recojo en Cusco o Valle Sagrado, traslado a Anta (55 min), Instrucciones y práctica en cuatrimotos por 10 minutos, Recorrido en cuatrimoto por las pampas de Anta, visita a las terrazas Incas de Zurite, nos dirigiremos al pueblo colonial de Huarocondo, se camaniara por el pueblo, asenderemos por los pueblos andinois de Anta y Maras para llegar a la Laguna de Huaypo, actividades acuáticas y tiempo libre. Retorno a la base de Anta por una ruta diferente. Traslado de regreso al hotel. 

No incluye
Seguros contra accidentes personales y de las cuatrimotos
Comidas', 12, 75, 'Aventura', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Tour Cuatrimotos Maras, Moray y Salineras 1/2 Dia | Visite Moray, Salineras o Laguna de huaypo mas salineras en servicio grupal economico', 'Recojo de hotel, viaje de 55 minutos a la base en Maras, se brinda información y recomendaciones, práctica en las cuatrimotos, recorrido hacia las terrazas incas de Moray donde se pasara por los paisajes de Maras, regreso a la base, se continúa en transporte privado hacia las minas de sal debido a restricciones para cuatrimotos, luego se regresa a nuestro hotel. 

No incluye
Entradas a Moray (70 Soles) y Minas de Sal (20 Soles)
Cualquier Seguro Personal y para los cuatrimotos
Laguna de Huaypo (si no tiene el boleto turistico para Moray le recomendamos esta ruta para evitar el pago de 70 Soles a Moray)', 12, 35, 'Aventura', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Parapente en Cusco | Parapente en el Valle Sagrado y Rahuanqui de Anta | en servicio Grupal', 'Recojo de hotel entre 6:15 y 6:30 A.M, viaje de una hora a la cima de la montaña sobre el Valle Sagrado, charla con los pilotos, se coloca el equipo y se vuela sobre los paisajes del Valle Sagrado. Se recomienda llevar una GoPro, se toma el transporte a su hotel. 

No incluye:
pago simbolico de 10 Soles para la comunidad', 12, 99, 'Aventura', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Parapente en Cusco | Parapente en el Valle Sagrado y Rahuanqui de Anta | Exclusivo Privado', 'Recojo de hotel entre (7 a 8 A.M), viaje de una hora a la cima de la montaña sobre el Valle Sagrado, charla con los pilotos, se coloca el equipo y se vuela sobre los andenes incas de Zurite en Eco Park de Rahuanqui y se toma el transporte de retorno a nuestro hotel. 

No incluye:
pago simbolico de 10 Soles para la comunidad', 12, 175, 'Aventura', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Tour a caballo en Valle Sagrado | Maras Moray, Salineras y Chinchero en Servicio Exclusivo Privado', 'Recojo de hotel, viaje de 55 minutos a Chinchero para visitar el centro textil y aprender sobre los tejidos y técnicas de teñido Inca. Se visita el pueblo de Chinchero y luego se viaja a Maras, donde esperan los Caballos de Paso Peruano. Tras una charla informativa, se monta a caballo hacia las terrazas circulares de Moray. Después, se retorna a Maras y se visita las Salineras de Maras, con aproximadamente 4000 piscinas. Finalmente, retorno en transporte privado al hotel en Cusco o Valle Sagrado.

Que no incluye:
Boletos de Ingreso a Chinchero y Moray (70 Soles) Salineras (20 Soles)

Precio:
US$ 145 Dólares Por Persona en nuestro Paseo Regular de 3 Horas a Caballo
US$ 175 Dólares Por Persona en nuestro Paseo más Largo, 5 Horas a Caballo', 24, 145, 'Aventura', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Tour a Caballo en el Valle Sagrado | Laguna de Huaypo, Mirador del Valle Sagrado y Chinchero en Servicio Exclusivo Privado', 'Recojo de hotel, viaje de 55 minutos a Chinchero para aprender sobre tejidos incas y técnicas de teñido. Visita al pueblo de Chinchero, luego viaje a Maras Moray para montar Caballos de Paso Peruano. Se cabalga a orillas de la Laguna de Huaypo y se sigue por un sendero hasta un mirador con vistas del Valle Sagrado y los nevados Chicon, Pitusiray y Veronica. Todo el tour es guiado, y al final se regresa al hotel en Cusco o Valle Sagrado. 

No incluye:
Ingreso a Chinchero (70 Soles) opcional', 12, 135, 'Aventura', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Tour a Caballo en Sacsayhuamán Cusco | Paseo en Caballo alrededor de Cusco Medio Día con Cusco Perú Adventure', 'Recojo de hotel, viaje de 15 minutos al Parque Nacional de Sacsayhuamán. Inicio de la cabalgata hacia el Templo de la Luna, donde se hace una pequeña visita guiada. Luego, se continúa cabalgando por el bosque de eucaliptos hasta el mirador en el sitio arqueológico de Inkilltambo, con vistas de Cusco y Sacsayhuamán. Se visitan los sitios arqueológicos de Qenqo, Puka Pucara y Tambomachay. El tour dura medio día y puede ser en la mañana o tarde, con retorno al hotel en transporte privado. 

Recomendaciones:
Sombrero
Bloqueador solar
Gafas de sol
Freno de viento
Ropa cómoda

No incluye:
Ingreso a los sitios Arqueológicos (parte del Boleto Turistico)', 12, 75, 'Aventura', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Tour Montaña 7 Colores Full Day | Como llegar a la montaña de 7 colores desde Cusco | en Tour exclusivo Privado', 'Recojo de hotel en Cusco a las 8:00 o 9:00 a.m., viaje de 3 horas hasta Tintinco en Cusipata. Caminata de 2 horas hacia la Montaña Vinicunca, se recomienda alquilar un caballo para facilitar el ascenso. El sendero ofrece paisajes coloridos, riachuelos y vistas de los Andes, con llamas, alpacas y vicuñas. En el punto más alto se disfruta de la vista de la Montaña Arcoíris. Después de tomar fotos, se desciende a Huachipata para almorzar, y luego se regresa a Cusco. El tour privado ofrece un horario flexible y asistencia profesional. 

Recomendaciones:
Mochila, ropa de abrigo (bufanda, suéteres, chubasquero, guantes)
Botas para caminar.
Poncho de lluvia
Gafas de sol.
Crema solar
Dinero extra en soles

No incluye:
Alquiler de Caballos
Desayuno
Entradas (25 soles)', 24, 115, 'Caminata', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Tour Montaña 7 Colores Full Day | Como llegar a la montaña de 7 colores desde Cusco | En Tour Economico Grupal', 'Recojo temprano de hotel en Cusco, seguido de un viaje de 3 horas a Tintinco en Cusipata para disfrutar de un desayuno. Luego, comienza una caminata de 3 horas hacia la Montaña Vinicunca, atravesando paisajes coloridos y riachuelos. Durante el ascenso, se podrán ver llamas, alpacas y vicuñas, junto con impresionantes vistas de los Andes y montañas glaciares. Al llegar al punto más alto, se aprecia la Montaña Arcoíris (Vinicunca) y se toman fotos. Después, se desciende a Huachipata para almorzar y se regresa a Cusco. 

Recomendaciones:
Ropa de abrigo (bufanda, suéteres, impermeable, guantes)
Botas para caminar.
Bastones
Poncho de lluvia
Sombrero para el sol + gafas de sol.
Papel higiénico y desinfectante de manos.
Protector solar
Dinero extra en soles

No incluye:
Ingreso a la Montaña 7 colores (25 Soles p.p)
Caballos
Cena', 24, 30, 'Caminata', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Turismo Vivencial Cusco – Turismo Vivencial en Cusco Perú Maras Moray, Chinchero, Mullacas Misminay en Tour Exclusivo Privado 2D/1N', 'Día 1: Recojo de los clientes desde el aeropuerto u hotel en Cusco o el Valle Sagrado. Visita al centro textil y las ruinas incas en Chinchero. Luego, visita a los sitios arqueológicos de Maras Moray y las Salineras del Valle Sagrado. Llegada a la comunidad de Mullacas Misminay, donde serán recibidos con música, bailes y vestimenta tradicional. Almuerzo típico de Pachamanca. Por la noche, cena familiar alrededor de un fuego con historias y leyendas locales.

Día 2: Desayuno tradicional andino en la casa familiar. Participación en dos actividades:

- Actividad 1: Demostración de textiles, donde aprenderán sobre las técnicas de preparación de lana y el uso de tintes naturales, realizada por mujeres de la comunidad.
  
- Actividad 2: Demostración de agricultura, donde conocerán las técnicas ancestrales en las fincas y podrán participar en las actividades agrícolas.

Retorno a su hotel en Cusco o el Valle Sagrado en la tarde, concluyendo el tour. 

No incluye:
Entradas a los lugares turísticos', 54, 299, 'Vivencial', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Turismo Vivencial Cusco – Turismo Vivencial en Mullacas Misminay full day en servicio Exclusivo Privado', 'El viaje inicia con la recogida de los clientes en el aeropuerto de Cusco o en hoteles de la ciudad o Valle Sagrado. Se visita el pueblo Inca de Chinchero, donde se exploran un centro textil y las ruinas incas. Luego, se dirigen a los sitios arqueológicos de Maras, Moray y las Salineras de Maras. A continuación, los visitantes llegan a la comunidad de Mullacas Misminay, donde son recibidos con música y danzas tradicionales. El almuerzo consiste en Pachamanca, un platillo típico preparado con carne, especias y productos andinos, cocidos con piedras. 

Las actividades incluyen:
1. Demostración de Textiles: Aprendizaje sobre técnicas tradicionales de extracción de lana y uso de tintes naturales, realizado por mujeres de la comunidad.
2. Demostración de Agricultura: Conocimiento sobre técnicas ancestrales y herramientas utilizadas en la agricultura local, con la oportunidad de participar.

Al final de la tarde, se regresa en transporte privado al hotel en Cusco o Valle Sagrado. 

No incluido:
Los boletos de Ingreso a Chinchero, Maras Moray', 24, 129, 'Vivencial', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Turismo Vivencial Cusco – Turismo Vivencial en Cusco Perú – en el pueblo Colonial de Huarocondo en la Provincia de Anta, en servicio Exclusivo Privado', 'Recojo de clientes en el aeropuerto de Cusco o en hoteles de Cusco y Valle Sagrado. Visita a las Terrazas Incas de Zurite, utilizadas por los Incas como laboratorio agrícola y todavía en uso para preservar semillas nativas. Después, se visita el pueblo colonial de Huarocondo. Luego, se dirigen a la comunidad de Marjko, donde son recibidos con música, bailes y vestimenta típica. 

- Almuerzo: Disfrutan de la pachamanca, un platillo ancestral que incluye carne, papas, camote y otros ingredientes andinos, cocidos con piedras precalentadas.

- Actividades:
  1. Ordeño de vacas: Aprenderán técnicas tradicionales de ordeñar, guiados por mujeres del pueblo.
  2. Preparación de quesos andinos: Demostración de técnicas ancestrales en la elaboración de quesos.

Transporte de regreso a su hotel en Cusco o Valle Sagrado.', 24, 115, 'Vivencial', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Tour Valle Sagrado de los Incas | Tour al Valle Sagrado de los Incas Full Day | Pisac, Ollantaytambo y Chinchero en Tour Economico Grupal', 'Inicio del tour a las 8:30 a.m. con recojo de hoteles. Primera parada en el mirador de Taray para disfrutar del Valle Sagrado. Visita al Mercado Artesanal de Pisac, donde se encuentran diversas artesanías. Luego, recorrido por el sitio arqueológico de Pisac con un guía profesional que explica sobre el pueblo inca y sus terrazas agrícolas. Almuerzo en un restaurante turístico en Urubamba. Continuamos hacia Ollantaytambo para apreciar el templo del sol. Antes de regresar a Cusco, parada en Chinchero para visitar una casa textil y el pueblo inca. Llegada a Cusco alrededor de las 7:00 p.m., cerca de la plaza principal.

No incluye:
Boleto de Ingreso a los parques Arqueológicos (70 Soles)', 24, 35, 'Caminata', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Tour Valle Sagrado de los Incas | Tour al Valle Sagrado de los Incas Full Day | Pisac, Ollantaytambo y Chinchero en Tour Privado', 'Inicio del tour a las 8:30 a.m. con recojo de hoteles. Primera parada en el mirador de Taray para disfrutar del Valle Sagrado. Visita al Mercado Artesanal de Pisac, donde se encuentran diversas artesanías. Luego, recorrido por el sitio arqueológico de Pisac con un guía profesional que explica sobre el pueblo inca y sus terrazas agrícolas. Almuerzo en un restaurante turístico en Urubamba. Continuamos hacia Ollantaytambo para apreciar el templo del sol. Antes de regresar a Cusco, parada en Chinchero para visitar una casa textil y el pueblo inca. Llegada a Cusco alrededor de las 7:00 p.m., cerca de la plaza principal.

No incluye:
Boleto de Ingreso a los parques Arqueológicos (70 Soles) 

En nuestro Tour Privado Exclusivo, la salida es a la mejor hora del Cliente con paradas muy flexibles en cada sitio y podemos iniciar el tour desde la ciudad de Cusco o desde su lindo hotel del Valle Sagrado.', 24, 115, 'Caminata', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('City Tour Cusco – Saqsayhuaman, Qenqo, Pucapucara, Tambomachay, Templo del Sol Qoricancha y Catedral de Cusco En Servicio Exclusivo Privado', 'Recojo de hoteles o del aeropuerto del Cusco. Primera parada en la Catedral del Cusco, luego visita al templo del Sol Qoricancha, seguido de la fortaleza de Saqsayhuaman. Se continúa hacia Qenqo, Pucapucara y Tambomachay, lugares místicos donde los Incas realizaban rituales en honor al agua. Finaliza el tour con el regreso al hotel en Cusco. 

No incluye:
Las entradas a los sitios arqueológicos', 12, 45, 'Caminata', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('City Tour Cusco – Saqsayhuaman, Qenqo, Pucapucara,Tambomachay, Templo del Sol Qoricancha y Catedral – en Servicio Económico Grupal', 'Recojo de hoteles. Visita a la Catedral del Cusco y luego al templo del Sol Qoricancha. Se continúa a la fortaleza de Saqsayhuaman y luego a los templos de Qenqo, Pucapucara y Tambomachay, donde los Incas realizaban ceremonias de purificación. El tour finaliza con el regreso a Cusco. 

No incluye:
Las entradas a los sitios arqueológicos , Boleto General Turístico , Boleto ala Catedral y el Boleto al Qoricancha.', 12, 10, 'Caminata', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('City Tour Cusco – Caminata por la antigua Ciudad Inca de Pisac, Saqsayhuaman, Qenqo, Pucapucara, Tambomachay en Servicio Exclusivo Privado', 'Recojo de los hoteles a las 8:00 a.m. para visitar el sitio arqueológico de Saqsayhuaman, seguido de Qenqo, Pucapucara y Tambomachay. Luego, se viaja al Valle Sagrado y al pueblo inca de Pisac, donde se realiza una caminata por terrazas, templos y vecindarios incas. El recorrido termina en el pueblo colonial de Pisac, visitando su mercado de artesanías. Regreso al hotel en Cusco o en el Valle Sagrado. 

No inculye:
Las entradas a los sitios arqueológicos.', 24, 75, 'Caminata', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Tour Valle Sur Tipon Piquillaqta Andahuaylillas | Privado', 'Recojo de los pasajeros a las 8:30 a.m. para visitar Tipón, un sitio inca con un avanzado sistema de canales de riego. Luego, se visita Piquillacta, una ciudad preincaica de la cultura Wari. Finalmente, se llega a Andahuaylillas, donde destaca su iglesia con murales y decoración colonial, conocida como la Capilla Sixtina de América. El tour apoya obras sociales en los pueblos remotos de Maras. 

No incluye:
Entradas a los lugares turísticos
Comida', 12, 55, 'Caminata', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Tour Valle Sur Tipon Piquillaqta Andahuaylilla | Grupal', 'Recojo de los pasajeros a las 8:30 a.m. para visitar Tipón, un sitio inca con un avanzado sistema de canales de riego. Luego, se visita Piquillacta, una ciudad preincaica de la cultura Wari. Finalmente, se llega a Andahuaylillas, donde destaca su iglesia con murales y decoración colonial, conocida como la Capilla Sixtina de América. El tour apoya obras sociales en los pueblos remotos de Maras. 

No incluye:
Entradas a los lugares turísticos
Comida', 24, 15, 'Caminata', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Tour Laguna Humantay – Trekking Laguna Humantay full Day en Cusco Perú | Privado', 'Recojo de los pasajeros a las 4:30 a.m. y viaje de 3 horas a Soraypampa, donde se desayuna antes de comenzar la caminata hacia la Laguna Humantay. Si la caminata es difícil, se puede rentar un caballo. Se disfruta del paisaje en la laguna y algunos pueden nadar si el clima lo permite. Después, se desciende a Soraypampa para almorzar antes de regresar a Cusco en transporte privado. 

No incluye:
Tickets de ingreso (S/. 15 Soles)
Snacks
Botas de montaña.
Poncho.
Medicación personal.
Cámara y batería extra.', 24, 85, 'Caminata', 1);
INSERT INTO tours (tour, descripcion, duracion, precio, categoria, activo) VALUES ('Tour Laguna Humantay – Trekking Laguna Humantay full Day en Cusco Perú | Grupal', 'Recojo de los pasajeros a las 4:30 a.m. y viaje de 3 horas a Soraypampa, donde se desayuna antes de comenzar la caminata hacia la Laguna Humantay. Si la caminata es difícil, se puede rentar un caballo. Se disfruta del paisaje en la laguna y algunos pueden nadar si el clima lo permite. Después, se desciende a Soraypampa para almorzar antes de regresar a Cusco en transporte privado. 

No incluye:
Tickets de ingreso (S/. 15 Soles)
Snacks
Botas de montaña.
Poncho.
Medicación personal.
Cámara y batería extra.', 24, 25, 'Caminata', 1);


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