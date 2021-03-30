-- =========================== ================== DDL ================= =================== ============
-- ------ NEW DATABASE -----
CREATE DATABASE gveDB;
USE gveDB;

-- ------ TABLE TEMPORAL -----
CREATE TABLE Temporal(
    temporalID INT NOT NULL AUTO_INCREMENT,
    /* =========== DATOS DE ENFERMO =========== */
    nombre_victima VARCHAR(100),
    apellido_victima VARCHAR(100),
    direccion_victima VARCHAR(100),
    fecha_primer_sopecha VARCHAR(100),
    fecha_confirmacion VARCHAR(100),
    fecha_muerte VARCHAR(100),
    estado_victima VARCHAR(100),
    /* =========== DATOS DEL ASOCIADO =========== */
    nombre_asociado VARCHAR(100),
    apellido_asociado VARCHAR(100),
    fecha_conocio VARCHAR(100),
    tipo_contacto VARCHAR(100),
    fecha_inicio_contacto VARCHAR(100),
    fecha_fin_contacto VARCHAR(100),
    /* =========== DATOS DEL HOSPITAL =========== */
    nombre_hospital VARCHAR(100),
    ubicacion_hospital VARCHAR(100),
    /* =========== DATOS DEL LUGAR CONTAGIO =========== */
    ubicacion_victima VARCHAR(100),
    fecha_llegada VARCHAR(100),
    fecha_retiro VARCHAR(100),
    /* =========== DATOS DEL TRATAMIENTO =========== */
    nombre_tratamiento VARCHAR(100),
    efectividad_tratamietno VARCHAR(100),
    fecha_incio_tratamiento VARCHAR(100),
    fecha_fin_tratamiento VARCHAR(100),
    efectividad_tratamiento_victima VARCHAR(100),
    PRIMARY KEY(temporalID)
);
-- ------ TABLE HOSPITAL -----
CREATE TABLE Hospital(
    hospitalID INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    PRIMARY KEY(hospitalID)
);
-- ------ TABLE ENFERMO -----
CREATE TABLE Enfermo(
    enfermoID INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    direccion VARCHAR(100) NOT NULL,
    estado VARCHAR(100) NOT NULL,
    fechaSospecha DATETIME NOT NULL,
    fechaConfirmacion DATETIME NOT NULL,
    fechaMuerte DATETIME,
    PRIMARY KEY(enfermoID)

);
-- ------ TABLE TRATAMIENTO -----
CREATE TABLE Tratamiento(
    tratamientoID INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    efectividad VARCHAR(100) NOT NULL,
    PRIMARY KEY(tratamientoID)
);
-- ------ TABLE ASOCIADO -----
CREATE TABLE Asociado(
    asociadoID INT NOT NULL AUTO_INCREMENT,
    nombre VARCHAR(100) NOT NULL,
    apellido VARCHAR(100) NOT NULL,
    PRIMARY KEY(asociadoID)
);
-- ------ TABLE TRATAMIENTO ENFERMO -----
CREATE TABLE TratamientoEnfermo(
    tratamientoEnfermoID INT NOT NULL AUTO_INCREMENT,
    efectividad INT NOT NULL,
    fechaInicio DATETIME NOT NULL,
    fechaFin DATETIME NOT NULL,
    tratamientoID INT NOT NULL,
    enfermoID INT NOT NULL,
    hospitalID INT NOT NULL,
    PRIMARY KEY(tratamientoEnfermoID),
    FOREIGN KEY(tratamientoID) REFERENCES Tratamiento(tratamientoID),
    FOREIGN KEY(enfermoID) REFERENCES Enfermo(enfermoID)
);
-- ------ TABLE DETALLE ASOCIADO -----
CREATE TABLE DetalleAsociado(
    detalleAsociadoID INT NOT NULL AUTO_INCREMENT,
    fechaConocio DATETIME NOT NULL,
    asociadoID INT NOT NULL,
    enfermoID INT NOT NULL,
    PRIMARY KEY(detalleAsociadoID),
    FOREIGN KEY(asociadoID) REFERENCES Asociado(asociadoID),
    FOREIGN KEY(enfermoID) REFERENCES Enfermo(enfermoID)
);
-- ------ TABLE CONTACTO CONTAGIO -----
CREATE TABLE ContactoContagio(
    contactoContagioID INT NOT NULL AUTO_INCREMENT,
    tipo VARCHAR(100) NOT NULL,
    fechaContacto DATETIME NOT NULL,
    fechaFinContacto DATETIME NOT NULL,
    asociadoID INT NOT NULL,
    enfermoID INT NOT NULL,
    PRIMARY KEY(contactoContagioID),
    FOREIGN KEY(asociadoID) REFERENCES Asociado(asociadoID),
    FOREIGN KEY(enfermoID) REFERENCES Enfermo(enfermoID)
);
-- ------ TABLE LUGAR CONTAGIO -----
CREATE TABLE LugarContagio(
    lugarId INT NOT NULL AUTO_INCREMENT,
    ubicacion VARCHAR(100) NOT NULL,
    fechaLLegada DATETIME NOT NULL,
    fechaSalida DATETIME NOT NULL,
    enfermoID INT NOT NULL,
    PRIMARY KEY(lugarId),
    FOREIGN KEY(enfermoID) REFERENCES Enfermo(enfermoID)
);

