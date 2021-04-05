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
