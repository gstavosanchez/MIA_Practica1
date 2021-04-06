/* ====== ======================== =============== DML ===============  ======================== ====== */
-- ===========================  PROCEDURES  ===========================
-- ------ PROCEDURE INSERT HOSPITAL -----
DELIMITER $$
CREATE PROCEDURE sp_insert_hospital(
    IN _nombre VARCHAR(100),
    IN _ubicacion VARCHAR(100)
)
    BEGIN
        DECLARE searchID INT DEFAULT 0;
        IF (_nombre != '') THEN
            SET searchID = (SELECT hospitalID FROM Hospital WHERE
                             nombre LIKE CONCAT('%',_nombre,'%') AND direccion LIKE CONCAT('%',_ubicacion,'%'));
        ELSE
            SET searchID = 1;
        END IF;
        IF (searchID <=> 0 OR searchID IS NULL) THEN
		    INSERT INTO Hospital(nombre,direccion) VALUES (_nombre,_ubicacion);
        END IF;
	
    END$$
DELIMITER ;
-- ------ PROCEDURE INSERT ENFERMO -----
DELIMITER $$
CREATE PROCEDURE sp_insert_enfermo(
    IN _nombre_victima VARCHAR(100),
    IN _apellido_victima VARCHAR(100),
    IN _direccion_victima VARCHAR(100),
    IN _fecha_primer_sopecha VARCHAR(100),
    IN _fecha_confirmacion VARCHAR(100),
    IN _fecha_muerte VARCHAR(100),
    IN _estado_victima VARCHAR(100)
)
    BEGIN
        DECLARE searchID INT DEFAULT 0;
        
        SET searchID = (SELECT enfermoID FROM Enfermo WHERE nombre LIKE CONCAT('%',_nombre_victima,'%') AND 
                         apellido LIKE CONCAT('%',_apellido_victima,'%') AND direccion LIKE CONCAT('%',_direccion_victima,'%')
                         AND estado LIKE CONCAT('%',_estado_victima,'%') );
        IF (searchID <=> 0 OR searchID is NULL) THEN
            IF (_fecha_muerte != '')THEN
                INSERT INTO Enfermo(nombre,apellido,direccion,estado,fechaSospecha,fechaConfirmacion,fechaMuerte)
                VALUES (_nombre_victima,_apellido_victima,_direccion_victima,_estado_victima,CAST(_fecha_primer_sopecha AS DATETIME),CAST(_fecha_confirmacion AS DATETIME),CAST(_fecha_muerte AS DATETIME));
            ELSE
                INSERT INTO Enfermo(nombre,apellido,direccion,estado,fechaSospecha,fechaConfirmacion,fechaMuerte)
                VALUES (_nombre_victima,_apellido_victima,_direccion_victima,_estado_victima,CAST(_fecha_primer_sopecha AS DATETIME),CAST(_fecha_confirmacion AS DATETIME),CAST('0000-00-00 00:00:00' AS DATETIME));   
            END IF;
        END IF;
    END$$
DELIMITER ;
-- ------ PROCEDURE INSERT TRATAMIENTO -----
DELIMITER $$
CREATE PROCEDURE sp_insert_tratamiento(
    IN _nombre VARCHAR(100),
    IN _efectividad VARCHAR(100)
)
    BEGIN
        DECLARE searchID INT DEFAULT 0;
        IF (_nombre != '') THEN
            SET searchID = (SELECT tratamientoID FROM Tratamiento WHERE nombre
                             LIKE CONCAT('%',_nombre,'%') AND efectividad LIKE CONCAT('%',_efectividad,'%'));
        ELSE
            SET searchID = 1;
        END IF;
        IF (searchID <=> 0 OR searchID IS NULL) THEN
            INSERT INTO Tratamiento(nombre,efectividad) VALUES (_nombre,_efectividad);
        END IF;
    END$$
DELIMITER ;
-- ------ PROCEDURE INSERT TRATAMIENTO EFERMO -----
DELIMITER $$
CREATE PROCEDURE sp_insert_tratamiento_efermo(
    _nombre_victima VARCHAR(100),
    _apellido_victima VARCHAR(100),
    _direccion_victima VARCHAR(100),
    _nombre_hospital VARCHAR(100),
    _ubicacion_hospital VARCHAR(100),
    _nombre_tratamiento VARCHAR(100),
    _efectividad_tratamiento VARCHAR(100),
    _efectividad_victima VARCHAR(100),
    _fecha_incio_tratamiento VARCHAR(100),
    _fecha_fin_tratamiento VARCHAR(100)

)
    BEGIN
        DECLARE _enfermoID INT DEFAULT 0;
        DECLARE _hospitalID INT DEFAULT 0;
        DECLARE _tratamientoID INT DEFAULT 0;
        DECLARE searchID INT DEFAULT 0;
        IF (_nombre_victima != '' AND _nombre_hospital != '' AND _nombre_tratamiento != '') THEN
            SET _enfermoID = (SELECT enfermoID FROM Enfermo WHERE nombre LIKE CONCAT('%',_nombre_victima,'%') AND 
                                apellido LIKE CONCAT('%',_apellido_victima,'%') AND direccion LIKE CONCAT('%',_direccion_victima,'%'));
            SET _hospitalID = (SELECT hospitalID FROM Hospital WHERE
                                 nombre LIKE CONCAT('%',_nombre_hospital,'%') AND direccion LIKE CONCAT('%',_ubicacion_hospital,'%'));
            SET _tratamientoID = (SELECT tratamientoID FROM Tratamiento WHERE nombre
                                    LIKE CONCAT('%',_nombre_tratamiento,'%') AND efectividad LIKE CONCAT('%',_efectividad_tratamiento,'%'));
            SET searchID = (SELECT tratamientoEnfermoID FROM TratamientoEnfermo WHERE 
                            efectividad = _efectividad_victima AND tratamientoID = _tratamientoID AND enfermoID = _enfermoID AND hospitalID = _hospitalID
                            AND fechaInicio LIKE CONCAT('%',_fecha_incio_tratamiento,'%') AND fechaFin LIKE CONCAT('%',_fecha_fin_tratamiento,'%'));
            IF (_enfermoID != 0 AND _hospitalID != 0 AND _tratamientoID != 0) THEN
                IF (searchID <=> 0 OR searchID IS NULL) THEN
                    INSERT INTO TratamientoEnfermo(efectividad,fechaInicio,fechaFin,tratamientoID,enfermoID,hospitalID)
                    VALUES (_efectividad_victima * 1,CAST(_fecha_incio_tratamiento AS DATETIME),CAST(_fecha_fin_tratamiento AS DATETIME),_tratamientoID,_enfermoID,_hospitalID); 
                END IF;
            END IF;
        END IF;
    END$$
DELIMITER ;
-- ------ PROCEDURE LUGAR CONTACTO -----
DELIMITER $$
CREATE PROCEDURE sp_lugar_contacto(
    _nombre_victima VARCHAR(100),
    _apellido_victima VARCHAR(100),
    _direccion_victima VARCHAR(100),
    _ubicacion VARCHAR(100),
    _fecha_llegada VARCHAR(100),
    _fecha_retiro VARCHAR(100)
)
    BEGIN
        DECLARE _enfermoID INT DEFAULT 0;
        DECLARE searchID INT DEFAULT 0;
        IF (_nombre_victima != '' AND _ubicacion != '' AND _fecha_llegada != '' AND _fecha_retiro != '') THEN
            SET _enfermoID = (SELECT enfermoID FROM Enfermo WHERE nombre LIKE CONCAT('%',_nombre_victima,'%') AND 
                                apellido LIKE CONCAT('%',_apellido_victima,'%') AND direccion LIKE CONCAT('%',_direccion_victima,'%'));
            SET searchID = (SELECT lugarId FROM LugarContagio WHERE ubicacion LIKE CONCAT('%',_ubicacion,'%')
                            AND fechaLLegada LIKE CONCAT('%',_fecha_llegada,'%') AND fechaSalida LIKE CONCAT('%',_fecha_retiro,'%')
                            AND enfermoID = _enfermoID);
            IF (_enfermoID != 0) THEN
                IF (searchID <=> 0 OR searchID IS NULL) THEN
                    INSERT INTO LugarContagio(ubicacion,fechaLLegada,fechaSalida,enfermoID)
                    VALUES (_ubicacion,CAST(_fecha_llegada AS DATETIME),CAST(_fecha_retiro AS DATETIME) ,_enfermoID);
                END IF;
            END IF;
        END IF;
    END$$
DELIMITER ;
-- ------ PROCEDURE INSERT ASOCIADO -----
DELIMITER $$
CREATE PROCEDURE sp_insert_asociado(
    IN _nombre VARCHAR(100),
    IN _apellido VARCHAR(100)
)
    BEGIN
        DECLARE searchID INT DEFAULT 0;
        IF (_nombre != '') THEN
            SET searchID = (SELECT asociadoID FROM Asociado WHERE nombre
                            Like CONCAT('%',_nombre,'%') AND apellido LIKE CONCAT('%',_apellido,'%'));
        ELSE
            SET searchID = 1;
        END IF;
        IF (searchID <=> 0 OR searchID IS NULL) THEN
            INSERT INTO Asociado(nombre,apellido) VALUES (_nombre,_apellido);
        END IF;
    END$$
DELIMITER ;
-- ------ PROCEDURE INSERT DETALLE ASOCIADO -----
DELIMITER $$
CREATE PROCEDURE sp_insert_detalle_asociado(
    _nombre_victima VARCHAR(100),
    _apellido_victima VARCHAR(100),
    _direccion_victima VARCHAR(100),
    _nombre_asociado VARCHAR(100),
    _apellido_asociado VARCHAR(100),
    _fecha_conocio VARCHAR(100)
)
    BEGIN
        DECLARE _enfermoID INT DEFAULT 0;
        DECLARE _asociadoID INT DEFAULT 0;
        DECLARE searchID INT DEFAULT 0;
        IF (_nombre_victima != '' AND _nombre_asociado != '' AND _fecha_conocio != '') THEN
            SET _enfermoID = (SELECT enfermoID FROM Enfermo WHERE nombre LIKE CONCAT('%',_nombre_victima,'%') AND 
                                apellido LIKE CONCAT('%',_apellido_victima,'%') AND direccion LIKE CONCAT('%',_direccion_victima,'%'));
            SET _asociadoID = (SELECT asociadoID FROM Asociado WHERE nombre
                                Like CONCAT('%',_nombre_asociado,'%') AND apellido LIKE CONCAT('%',_apellido_asociado,'%'));
            SET searchID = (SELECT detalleAsociadoID FROM DetalleAsociado WHERE 
                            asociadoID = _asociadoID AND enfermoID = _enfermoID AND
                            fechaConocio LIKE CONCAT('%',_fecha_conocio,'%'));
            IF (_enfermoID != 0 AND _asociadoID != 0) THEN
                IF (searchID <=> 0 OR searchID IS NULL) THEN
                    INSERT INTO DetalleAsociado(enfermoID,asociadoID,fechaConocio) VALUES (_enfermoID,_asociadoID,CAST(_fecha_conocio AS DATETIME));
                END IF;
            END IF;
        END IF;
    END$$
DELIMITER ;
-- ------ PROCEDURE INSERT CONTACTO CONTAGIO -----
DELIMITER $$
CREATE PROCEDURE sp_insert_contacto_contagio(
    _nombre_victima VARCHAR(100),
    _apellido_victima VARCHAR(100),
    _direccion_victima VARCHAR(100),
    _nombre_asociado VARCHAR(100),
    _apellido_asociado VARCHAR(100),
    _tipo VARCHAR(100),
    _fecha_contacto VARCHAR(100),
    _fecha_fin_contacto VARCHAR(100)
)
    BEGIN
        DECLARE _enfermoID INT DEFAULT 0;
        DECLARE _asociadoID INT DEFAULT 0;
        DECLARE searchID INT DEFAULT 0;
        IF (_nombre_victima != '' AND _nombre_asociado != '' AND _fecha_contacto != '' AND _fecha_fin_contacto != ''
            AND _tipo != '') THEN
            SET _enfermoID = (SELECT enfermoID FROM Enfermo WHERE nombre LIKE CONCAT('%',_nombre_victima,'%') AND 
                            apellido LIKE CONCAT('%',_apellido_victima,'%') AND direccion LIKE CONCAT('%',_direccion_victima,'%'));
            SET _asociadoID = (SELECT asociadoID FROM Asociado WHERE nombre
                                Like CONCAT('%',_nombre_asociado,'%') AND apellido LIKE CONCAT('%',_apellido_asociado,'%'));
            SET searchID = (SELECT contactoContagioID FROM ContactoContagio WHERE
                            asociadoID = _asociadoID AND enfermoID = _enfermoID AND
                            tipo LIKE CONCAT('%',_tipo,'%') AND fechaContacto LIKE CONCAT('%',_fecha_contacto,'%') AND
                            fechaFinContacto LIKE CONCAT('%',_fecha_fin_contacto,'%'));
            IF (_enfermoID != 0 AND _asociadoID != 0) THEN
                IF (searchID <=> 0 OR searchID IS NULL) THEN
                    INSERT INTO ContactoContagio(tipo,fechaContacto,fechaFinContacto,asociadoID,enfermoID)
                    VALUES (_tipo,CAST(_fecha_contacto AS DATETIME),CAST(_fecha_fin_contacto AS DATETIME),_asociadoID,_enfermoID);
                END IF;
            END IF;
        END IF;
    END$$
DELIMITER ;
-- ------ PROCEDURE INSERT HOSPITALIZACION -----
DELIMITER $$
CREATE PROCEDURE sp_insert_hospitalizacion(
    _nombre_victima VARCHAR(100),
    _apellido_victima VARCHAR(100),
    _direccion_victima VARCHAR(100),
    _nombre_hospital VARCHAR(100),
    _ubicacion_hospital VARCHAR(100)
)
    BEGIN
        DECLARE _enfermoID INT DEFAULT 0;
        DECLARE _hospitalID INT DEFAULT 0;
        DECLARE searchID INT DEFAULT 0;
        IF (_nombre_victima != '' AND _nombre_hospital != '') THEN
            SET _enfermoID = (SELECT enfermoID FROM Enfermo WHERE nombre LIKE CONCAT('%',_nombre_victima,'%') AND 
                                apellido LIKE CONCAT('%',_apellido_victima,'%') AND direccion LIKE CONCAT('%',_direccion_victima,'%'));
            SET _hospitalID = (SELECT hospitalID FROM Hospital WHERE
                                nombre LIKE CONCAT('%',_nombre_hospital,'%') AND direccion LIKE CONCAT('%',_ubicacion_hospital,'%'));
            SET searchID = (SELECT hospitalizacionID FROM Hospitalizacion WHERE
                                hospitalID = _hospitalID AND enfermoID = _enfermoID);
            IF (_enfermoID != 0 AND  _hospitalID != 0) THEN
                IF (searchID <=> 0 OR searchID IS NULL) THEN
                    INSERT INTO Hospitalizacion(hospitalID,enfermoID) VALUES (_hospitalID,_enfermoID); 
                END IF;
            END IF;
        END IF;
    END$$
DELIMITER ;
-- ------ PROCEDURE INSERT TEMPORAL -----
DELIMITER $$
CREATE PROCEDURE sp_insert_temp(
    /* =========== DATOS DE ENFERMO =========== */
    IN _nombre_victima VARCHAR(100),
    IN _apellido_victima VARCHAR(100),
    IN _direccion_victima VARCHAR(100),
    IN _fecha_primer_sopecha VARCHAR(100),
    IN _fecha_confirmacion VARCHAR(100),
    IN _fecha_muerte VARCHAR(100),
    IN _estado_victima VARCHAR(100),
    /* =========== DATOS DEL ASOCIADO =========== */
    IN _nombre_asociado VARCHAR(100),
    IN _apellido_asociado VARCHAR(100),
    IN _fecha_conocio VARCHAR(100),
    IN _tipo_contacto VARCHAR(100),
    IN _fecha_inicio_contacto VARCHAR(100),
    IN _fecha_fin_contacto VARCHAR(100),
    /* =========== DATOS DEL HOSPITAL =========== */
    IN _nombre_hospital VARCHAR(100),
    IN _ubicacion_hospital VARCHAR(100),
    /* =========== DATOS DEL LUGAR CONTAGIO =========== */
    IN _ubicacion_victima VARCHAR(100),
    IN _fecha_llegada VARCHAR(100),
    IN _fecha_retiro VARCHAR(100),
    /* =========== DATOS DEL TRATAMIENTO =========== */
    IN _nombre_tratamiento VARCHAR(100),
    IN _efectividad_tratamietno VARCHAR(100),
    IN _fecha_incio_tratamiento VARCHAR(100),
    IN _fecha_fin_tratamiento VARCHAR(100),
    IN _efectividad_tratamiento_victima VARCHAR(100)
)
    BEGIN
        IF (_nombre_victima != '')THEN
            INSERT INTO Temporal(nombre_victima,apellido_victima,direccion_victima,fecha_primer_sopecha,fecha_confirmacion,fecha_muerte,estado_victima,
                            nombre_asociado,apellido_asociado,fecha_conocio,tipo_contacto,fecha_inicio_contacto,fecha_fin_contacto,
                            nombre_hospital,ubicacion_hospital,
                            ubicacion_victima,fecha_llegada,fecha_retiro,
                            nombre_tratamiento,efectividad_tratamietno,fecha_incio_tratamiento,fecha_fin_tratamiento,efectividad_tratamiento_victima)
            VALUES (_nombre_victima,_apellido_victima,_direccion_victima,_fecha_primer_sopecha,_fecha_confirmacion,_fecha_muerte,_estado_victima,
                    _nombre_asociado,_apellido_asociado,_fecha_conocio,_tipo_contacto,_fecha_inicio_contacto,_fecha_fin_contacto,
                    _nombre_hospital,_ubicacion_hospital,
                    _ubicacion_victima,_fecha_llegada,_fecha_retiro,
                    _nombre_tratamiento,_efectividad_tratamietno,_fecha_incio_tratamiento,_fecha_fin_tratamiento,_efectividad_tratamiento_victima);

            CALL sp_insert_hospital(_nombre_hospital,_ubicacion_hospital);
            CALL sp_insert_enfermo(_nombre_victima,_apellido_victima,_direccion_victima,_fecha_primer_sopecha,_fecha_confirmacion,_fecha_muerte,_estado_victima);
            CALL sp_insert_tratamiento(_nombre_tratamiento,_efectividad_tratamietno);
            CALL sp_insert_hospitalizacion(_nombre_victima,_apellido_victima,_direccion_victima,
                                            _nombre_hospital,_ubicacion_hospital);
            CALL sp_insert_asociado(_nombre_asociado,_apellido_asociado);
            CALL sp_insert_detalle_asociado(_nombre_victima,_apellido_victima,_direccion_victima,_nombre_asociado,_apellido_asociado,_fecha_conocio);
            CALL sp_insert_contacto_contagio(_nombre_victima,_apellido_victima,_direccion_victima,_nombre_asociado,_apellido_asociado,
                                            _tipo_contacto,_fecha_inicio_contacto,_fecha_fin_contacto);
            CALL sp_insert_tratamiento_efermo(_nombre_victima,_apellido_victima,_direccion_victima,
                                                _nombre_hospital,_ubicacion_hospital,_nombre_tratamiento,_efectividad_tratamietno,
                                                _efectividad_tratamiento_victima,_fecha_incio_tratamiento,_fecha_fin_tratamiento);
            CALL sp_lugar_contacto(_nombre_victima,_apellido_victima,_direccion_victima,
                                    _ubicacion_victima,_fecha_llegada,_fecha_retiro);
        END IF;
    END$$
DELIMITER ;