export const getListTables = ():string[] => {
    let list:string[] = [];
    const hospitaTB:string = `CREATE TABLE Hospital(
        hospitalID INT NOT NULL AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        direccion VARCHAR(100) NOT NULL,
        PRIMARY KEY(hospitalID)
        )`
    ;
    const enfermoTB:string = `CREATE TABLE Enfermo(
        enfermoID INT NOT NULL AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        direccion VARCHAR(100) NOT NULL,
        estado VARCHAR(100) NOT NULL,
        fechaSospecha DATETIME NOT NULL,
        fechaConfirmacion DATETIME NOT NULL,
        fechaMuerte DATETIME,
        PRIMARY KEY(enfermoID)
    
    )`;
    const tratamientoTB:string = `CREATE TABLE Tratamiento(
        tratamientoID INT NOT NULL AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        efectividad VARCHAR(100) NOT NULL,
        PRIMARY KEY(tratamientoID)
    )`;

    const asociadoTB:string = `CREATE TABLE Asociado(
        asociadoID INT NOT NULL AUTO_INCREMENT,
        nombre VARCHAR(100) NOT NULL,
        apellido VARCHAR(100) NOT NULL,
        PRIMARY KEY(asociadoID)
    )`;
    
    const tratamientoEnfermoTB:string = `CREATE TABLE TratamientoEnfermo(
        tratamientoEnfermoID INT NOT NULL AUTO_INCREMENT,
        efectividad INT NOT NULL,
        fechaInicio DATETIME NOT NULL,
        fechaFin DATETIME NOT NULL,
        tratamientoID INT NOT NULL,
        enfermoID INT NOT NULL,
        hospitalID INT NOT NULL,
        PRIMARY KEY(tratamientoEnfermoID),
        FOREIGN KEY(tratamientoID) REFERENCES Tratamiento(tratamientoID),
        FOREIGN KEY(enfermoID) REFERENCES Enfermo(enfermoID),
        FOREIGN KEY(hospitalID) REFERENCES Hospital(hospitalID)
    )`;
    const detalleAsociadoTB:string = `CREATE TABLE DetalleAsociado(
        detalleAsociadoID INT NOT NULL AUTO_INCREMENT,
        fechaConocio DATETIME NOT NULL,
        asociadoID INT NOT NULL,
        enfermoID INT NOT NULL,
        PRIMARY KEY(detalleAsociadoID),
        FOREIGN KEY(asociadoID) REFERENCES Asociado(asociadoID),
        FOREIGN KEY(enfermoID) REFERENCES Enfermo(enfermoID)
    )`;
    const contactoContagioTB:string = `CREATE TABLE ContactoContagio(
        contactoContagioID INT NOT NULL AUTO_INCREMENT,
        tipo VARCHAR(100) NOT NULL,
        fechaContacto DATETIME NOT NULL,
        fechaFinContacto DATETIME NOT NULL,
        asociadoID INT NOT NULL,
        enfermoID INT NOT NULL,
        PRIMARY KEY(contactoContagioID),
        FOREIGN KEY(asociadoID) REFERENCES Asociado(asociadoID),
        FOREIGN KEY(enfermoID) REFERENCES Enfermo(enfermoID)
    )`;
    const lugarContagio:string = `CREATE TABLE LugarContagio(
        lugarId INT NOT NULL AUTO_INCREMENT,
        ubicacion VARCHAR(100) NOT NULL,
        fechaLLegada DATETIME NOT NULL,
        fechaSalida DATETIME NOT NULL,
        enfermoID INT NOT NULL,
        PRIMARY KEY(lugarId),
        FOREIGN KEY(enfermoID) REFERENCES Enfermo(enfermoID)
    )`;
    const hospitalizacionTB:string = `CREATE TABLE Hospitalizacion(
        hospitalizacionID INT NOT NULL AUTO_INCREMENT,
        hospitalID INT NOT NULL,
        enfermoID INT NOT NULL,
        PRIMARY KEY(hospitalizacionID),
        FOREIGN KEY(hospitalID) REFERENCES Hospital(hospitalID),
        FOREIGN KEY(enfermoID) REFERENCES Enfermo(enfermoID)
    )`;
    
    list = [hospitaTB,enfermoTB,tratamientoTB,asociadoTB,
            tratamientoEnfermoTB,detalleAsociadoTB,contactoContagioTB,
            lugarContagio,hospitalizacionTB
        ]
    return list;
}
/* ================================== VISTAS ========================================== */
export const getViewList = ():string[] => {
    let viewList:string[] = [];
    const view1:string = `CREATE VIEW view_consulta1
        AS
        SELECT hp.nombre AS Hospital, hp.direccion AS Direccion,
        (SELECT COUNT(hz0.enfermoID) FROM Hospitalizacion AS hz0
            INNER JOIN Enfermo AS en0 ON en0.enfermoID = hz0.enfermoID
            WHERE hz0.hospitalID = hz.hospitalID
            AND en0.fechaMuerte > '0000-00-00 00:00:00'
        ) 'NoMuertos'
        FROM Hospital AS hp
        INNER JOIN Hospitalizacion AS hz ON hz.hospitalID = hp.hospitalID
        INNER JOIN Enfermo AS en ON en.enfermoID = hz.enfermoID
        WHERE (SELECT COUNT(hz0.enfermoID) FROM Hospitalizacion AS hz0
                INNER JOIN Enfermo AS en0 ON en0.enfermoID = hz0.enfermoID
                WHERE hz0.hospitalID = hz.hospitalID
                AND en0.fechaMuerte > '0000-00-00 00:00:00'
            ) > 0
        AND en.fechaMuerte > '0000-00-00 00:00:00'
        GROUP BY hp.nombre`
    ;
    const view2:string = `CREATE VIEW view_consulta2
    AS
        SELECT en.nombre AS Nombre, en.apellido AS Apellido,t.nombre AS Tratamiento,ten.efectividad AS efectividad
        FROM Enfermo AS en
        INNER JOIN TratamientoEnfermo AS ten ON ten.enfermoID = en.enfermoID
        INNER JOIN Tratamiento AS t ON t.tratamientoID = ten.tratamientoID
        WHERE t.nombre = 'Transfusiones de sangre'
        AND en.estado LIKE '%En cuarentena%'
        AND ten.efectividad > 5`;
    const view3:string = `CREATE VIEW view_consulta3
    AS
        SELECT en.nombre AS Nombre,en.apellido AS Apellido, en.direccion AS Direccion,
        (SELECT COUNT(asociadoID) FROM DetalleAsociado WHERE enfermoID = cc.enfermoID) 'No_Asociados'
        FROM Enfermo AS en
        INNER JOIN DetalleAsociado AS cc ON cc.enfermoID = en.enfermoID
        INNER JOIN Asociado AS a ON a.asociadoID = cc.asociadoID
        WHERE (SELECT COUNT(asociadoID) FROM DetalleAsociado WHERE enfermoID = cc.enfermoID) > 3
        AND en.fechaMuerte > '0000-00-00 00:00:00'
        GROUP BY cc.enfermoID`;
    const view4:string = `CREATE VIEW view_consulta4
    AS
        SELECT en.nombre AS Nombre,en.apellido AS Apellido,en.estado AS Estado,cc.tipo AS Tipo_Contacto,
        (SELECT COUNT(asociadoID) FROM ContactoContagio
            WHERE enfermoID = cc.enfermoID
            AND tipo LIKE '%Beso%'
        ) 'No_Asociados'
        FROM Enfermo AS en
        INNER JOIN ContactoContagio AS cc ON cc.enfermoID = en.enfermoID
        INNER JOIN Asociado AS a ON a.asociadoID = cc.asociadoID
        WHERE en.estado LIKE '%Sospecha%' AND
        cc.tipo LIKE '%Beso%'
        AND (SELECT COUNT(asociadoID) FROM ContactoContagio 
                WHERE enfermoID = cc.enfermoID
                AND tipo LIKE '%Beso%'
            ) > 2
        GROUP BY cc.enfermoID`;
    const view5:string = `CREATE VIEW view_consulta5
    AS
        SELECT en.nombre AS Nombre,en.apellido AS Apellido,
        (SELECT COUNT(enfermoID) FROM TratamientoEnfermo 
            WHERE enfermoID = ten.enfermoID 
            AND tratamientoID = (SELECT tratamientoID FROM Tratamiento 
            WHERE nombre LIKE'%Oxigeno%')
        ) 'NO_Tratamientos'
        FROM Enfermo AS en
        INNER JOIN TratamientoEnfermo AS ten ON ten.enfermoID = en.enfermoID
        INNER JOIN Tratamiento AS t ON t.tratamientoID = ten.tratamientoID
        WHERE t.nombre LIKE '%Oxigeno%'
        GROUP BY ten.enfermoID
        ORDER BY (SELECT COUNT(enfermoID) FROM TratamientoEnfermo WHERE enfermoID = ten.enfermoID 
                    AND tratamientoID = (SELECT tratamientoID FROM Tratamiento 
                    WHERE nombre LIKE'%Oxigeno%')
                ),en.nombre ASC
        LIMIT 5`;
    const view6:string = `CREATE VIEW view_consulta6
    AS
        SELECT en.nombre AS Nombre, en.apellido AS Apellido, en.fechaMuerte AS Fecha_Muerte,
        lc.ubicacion AS Ubicacion_victima, t.nombre AS Tratamiento
        FROM Enfermo AS en
        INNER JOIN TratamientoEnfermo AS ten ON ten.enfermoID = en.enfermoID
        INNER JOIN LugarContagio AS lc ON lc.enfermoID = ten.enfermoID
        INNER JOIN Tratamiento AS t ON t.tratamientoID = ten.tratamientoID
        AND t.nombre LIKE '%Manejo de la presion arterial%'
        AND lc.ubicacion LIKE '%1987 Delphine Well%'`;
    const view7:string = `CREATE VIEW view_consulta7
    AS
        SELECT en.nombre AS Nombre,en.apellido AS Apellido,en.direccion AS Direccion,
        (SELECT COUNT(asociadoID) FROM ContactoContagio WHERE enfermoID = cc.enfermoID) 'No_Asociados',
        (SELECT COUNT(enfermoID) FROM TratamientoEnfermo WHERE enfermoID = cc.enfermoID) 'No_tratamientos'
        FROM Enfermo AS en
        INNER JOIN ContactoContagio AS cc ON cc.enfermoID = en.enfermoID
        INNER JOIN TratamientoEnfermo AS ten ON  ten.enfermoID = cc.enfermoID
        WHERE (SELECT COUNT(enfermoID) FROM TratamientoEnfermo WHERE enfermoID = cc.enfermoID) <=> 2
        AND  (SELECT COUNT(asociadoID) FROM ContactoContagio WHERE enfermoID = cc.enfermoID) < 2
        GROUP BY cc.enfermoID`;
    const view8:string = `CREATE VIEW view_consulta8
    AS
        SELECT * FROM (
            SELECT en.nombre AS Nombre, en.apellido AS Apellido,(MONTH(en.fechaSospecha)) 'Mes_Sospecha',
            (SELECT COUNT(enfermoID) FROM TratamientoEnfermo WHERE enfermoID = ten.enfermoID ) No_tratamientos
            FROM Enfermo AS en
            INNER JOIN TratamientoEnfermo AS ten ON ten.enfermoID = en.enfermoID
            GROUP BY ten.enfermoID
            ORDER BY (No_tratamientos) DESC 
            LIMIT 5
        )A UNION
        SELECT * FROM (
            SELECT en.nombre AS Nombre, en.apellido AS Apellido,(MONTH(en.fechaSospecha)) 'Mes_Sospecha',
            (SELECT COUNT(enfermoID) FROM TratamientoEnfermo WHERE enfermoID = ten.enfermoID ) No_tratamientos
            FROM Enfermo AS en
            INNER JOIN TratamientoEnfermo AS ten ON ten.enfermoID = en.enfermoID
            GROUP BY ten.enfermoID
            ORDER BY (No_tratamientos) ASC 
            LIMIT 5
        )B`;
    const view9:string = `CREATE VIEW view_consulta9
    AS
        SELECT hp.nombre AS Hospital,(SELECT COUNT(enfermoID) FROM Hospitalizacion WHERE hospitalID = hz.hospitalID) 'Cantidad',
        (CONCAT(ROUND(
            ((SELECT COUNT(enfermoID) FROM Hospitalizacion WHERE hospitalID = hz.hospitalID)/(SELECT COUNT(enfermoID) FROM Hospitalizacion)) * 100,
            1),' %')) 'Porcentaje'
        FROM Hospital AS hp
        INNER JOIN Hospitalizacion AS hz ON hz.hospitalID = hp.hospitalID
        GROUP BY hz.hospitalID
        ORDER BY hp.nombre`;
    const view10:string = `CREATE VIEW view_consulta10
    AS
        SELECT Hospital,Tipo_Contacto,Cantidad,Porcentaje FROM (
            SELECT hp.nombre AS Hospital,cc.tipo AS Tipo_Contacto,
            (
                SELECT COUNT(cc1.tipo) FROM Hospitalizacion AS hz1
                    INNER JOIN Enfermo AS en1 on en1.enfermoID = hz1.enfermoID
                    INNER JOIN ContactoContagio AS cc1 on cc1.enfermoID = hz1.enfermoID
                    WHERE hz1.hospitalID = hz.hospitalID
                    and cc1.tipo = cc.tipo
            )Cantidad,
            (CONCAT(
                    ROUND((
                            (SELECT COUNT(cc1.tipo) FROM Hospitalizacion AS hz1
                                INNER JOIN Enfermo AS en1 on en1.enfermoID = hz1.enfermoID
                                INNER JOIN ContactoContagio AS cc1 on cc1.enfermoID = hz1.enfermoID
                                WHERE hz1.hospitalID = hz.hospitalID
                                and cc1.tipo = cc.tipo 
                            )/
                            (SELECT COUNT(cc2.tipo) FROM Hospitalizacion AS hz2
                                INNER JOIN Enfermo AS en2 on en2.enfermoID = hz2.enfermoID
                                INNER JOIN ContactoContagio AS cc2 on cc2.enfermoID = hz2.enfermoID
                                WHERE hz2.hospitalID = hz.hospitalID 
                            ))*100
                        ,1)
                ,' %')
            ) Porcentaje
            FROM Hospital AS hp
            INNER JOIN Hospitalizacion AS hz ON hz.hospitalID = hp.hospitalID
            INNER JOIN Enfermo AS en ON en.enfermoID = hz.enfermoID
            INNER JOIN ContactoContagio AS cc ON cc.enfermoID = hz.enfermoID
            GROUP BY hp.hospitalID,cc.tipo
            ORDER BY Cantidad DESC
        ) AS A GROUP BY Hospital`;
    viewList = [
        view1,view2,view3,
        view4,view5,view6,
        view7,view8,view9,
        view10
    ]
    return viewList;
}
/* ================================== ===========  PROCEDIMIENTOS ========== ========================================== */
export const getProceduresList = ():string[] => {
    let procedureList:string[] = [];

    const procedure1:string = `CREATE PROCEDURE sp_insert_hospital(
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
        
        END`;
    const procedure2:string = `CREATE PROCEDURE sp_insert_enfermo(
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
        END`;
    const procedure3:string = `CREATE PROCEDURE sp_insert_tratamiento(
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
        END`;
    const procedure4:string = `CREATE PROCEDURE sp_insert_tratamiento_efermo(
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
        END`;
    const procedure5:string = `CREATE PROCEDURE sp_lugar_contacto(
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
        END`;
    const procedure6:string = `CREATE PROCEDURE sp_insert_asociado(
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
        END`;
    const procedure7:string = `CREATE PROCEDURE sp_insert_detalle_asociado(
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
        END`;
    const procedure8:string = `CREATE PROCEDURE sp_insert_contacto_contagio(
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
        END$$`;
    const procedure9:string = `CREATE PROCEDURE sp_insert_hospitalizacion(
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
        END`;
    const procedure10:string = `CREATE PROCEDURE sp_insert_temp(
        IN _nombre_victima VARCHAR(100),
        IN _apellido_victima VARCHAR(100),
        IN _direccion_victima VARCHAR(100),
        IN _fecha_primer_sopecha VARCHAR(100),
        IN _fecha_confirmacion VARCHAR(100),
        IN _fecha_muerte VARCHAR(100),
        IN _estado_victima VARCHAR(100),
        IN _nombre_asociado VARCHAR(100),
        IN _apellido_asociado VARCHAR(100),
        IN _fecha_conocio VARCHAR(100),
        IN _tipo_contacto VARCHAR(100),
        IN _fecha_inicio_contacto VARCHAR(100),
        IN _fecha_fin_contacto VARCHAR(100),
        IN _nombre_hospital VARCHAR(100),
        IN _ubicacion_hospital VARCHAR(100),
        IN _ubicacion_victima VARCHAR(100),
        IN _fecha_llegada VARCHAR(100),
        IN _fecha_retiro VARCHAR(100),
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
        END`;
    procedureList = [
        procedure1,procedure2,procedure3,
        procedure4,procedure5,procedure6,
        procedure7,procedure8,procedure9,
        procedure10
    ]

    return procedureList;
}
