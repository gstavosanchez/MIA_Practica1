/* ====== ======================== =============== CONSULTAS ===============  ======================== ====== */
SELECT * FROM Hospital;
SELECT * FROM Hospitalizacion;
SELECT * FROM Temporal;
select * from Enfermo;
SELECT * FROM Tratamiento;
SELECT * FROM TratamientoEnfermo;
SELECT * FROM Asociado;
SELECT * FROM DetalleAsociado;
SELECT * FROM ContactoContagio;
SELECT * FROM LugarContagio;
/* ====== ELIMINAR ===== */
DROP VIEW view_consulta1;
DROP VIEW view_consulta2;
DROP VIEW view_consulta3;
/* ====== */
SELECT * FROM view_consulta1;
SELECT * FROM view_consulta2;
SELECT * FROM view_consulta3;
/*  ====== ======================== CONSULTA NO.1 ======================== ======*/
/* Mostrar el nombre del hospital, su dirección y el número de fallecidos por
    cada hospital registrado. */
CREATE VIEW view_consulta1
AS
    SELECT hp.nombre AS Hospital, hp.direccion AS Direccion,
    (SELECT COUNT(enfermoID) FROM Enfermo WHERE fechaMuerte > '0000-00-00 00:00:00' AND enfermoID = hz.enfermoID) 'NoMuertos'
    FROM Hospital AS hp
    INNER JOIN Hospitalizacion AS hz ON hz.hospitalID = hp.hospitalID
    INNER JOIN Enfermo AS en ON en.enfermoID = hz.enfermoID
    WHERE (SELECT COUNT(enfermoID) FROM Enfermo WHERE fechaMuerte > '0000-00-00 00:00:00' AND enfermoID = hz.enfermoID) > 0
    GROUP BY hp.nombre
;
/*  ====== ======================== CONSULTA NO.2 ======================== ======*/
/* Mostrar el nombre, apellido de todas las víctimas en cuarentena que
    presentaron una efectividad mayor a 5 en el tratamiento “Transfusiones de
    sangre”. */
CREATE VIEW view_consulta2
AS
    SELECT en.nombre AS Nombre, en.apellido AS Apellido,t.nombre AS Tratamiento,ten.efectividad AS efectividad
    FROM Enfermo AS en
    INNER JOIN TratamientoEnfermo AS ten ON ten.enfermoID = en.enfermoID
    INNER JOIN Tratamiento AS t ON t.tratamientoID = ten.tratamientoID
    WHERE t.nombre = 'Transfusiones de sangre' AND
    ten.efectividad > 5
;
/*  ====== ======================== CONSULTA NO.3 ======================== ======*/
/* Mostrar el nombre, apellido y dirección de las víctimas fallecidas con más de
    tres personas asociadas. */
CREATE VIEW view_consulta3
AS
    SELECT en.nombre AS Nombre,en.apellido AS Apellido, en.direccion AS Direccion,
    (SELECT COUNT(asociadoID) FROM ContactoContagio WHERE enfermoID = cc.enfermoID) 'No_Asociados'
    FROM Enfermo AS en
    INNER JOIN ContactoContagio AS cc ON cc.enfermoID = en.enfermoID
    INNER JOIN Asociado AS a ON a.asociadoID = cc.asociadoID
    WHERE (SELECT COUNT(asociadoID) FROM ContactoContagio WHERE enfermoID = cc.enfermoID) > 3
    GROUP BY cc.enfermoID
;
/*  ====== ======================== CONSULTA NO.4 ======================== ======*/
/* Mostrar el nombre y apellido de todas las víctimas en estado “SOSPECHA”
    que tuvieron contacto físico de tipo “Beso” con más de 2 de sus asociados. */
CREATE VIEW view_consulta4
AS
    SELECT en.nombre AS Nombre,en.apellido AS Apellido,en.estado AS Estado,cc.tipo AS Tipo_Contacto,
    (SELECT COUNT(asociadoID) FROM ContactoContagio WHERE enfermoID = cc.enfermoID) 'No_Asociados'
    FROM Enfermo AS en
    INNER JOIN ContactoContagio AS cc ON cc.enfermoID = en.enfermoID
    INNER JOIN Asociado AS a ON a.asociadoID = cc.asociadoID
    WHERE en.estado LIKE '%Sospecha%' AND
    cc.tipo LIKE '%Beso%'
    AND (SELECT COUNT(asociadoID) FROM ContactoContagio WHERE enfermoID = cc.enfermoID) > 2
    GROUP BY cc.enfermoID
;
/*  ====== ======================== CONSULTA NO.5 ======================== ======*/
/* Top 5 de víctimas que más tratamientos se han aplicado del tratamiento
    “Oxígeno”. */
CREATE VIEW view_consulta5
AS
    SELECT en.nombre AS Nombre,en.apellido AS Apellido,
    (SELECT COUNT(enfermoID) FROM TratamientoEnfermo WHERE enfermoID = ten.enfermoID 
    AND tratamientoID = (SELECT tratamientoID FROM Tratamiento WHERE nombre LIKE'%Oxigeno%')) 'NO_Tratamientos'
    FROM Enfermo AS en
    INNER JOIN TratamientoEnfermo AS ten ON ten.enfermoID = en.enfermoID
    INNER JOIN Tratamiento AS t ON t.tratamientoID = ten.tratamientoID
    WHERE t.nombre LIKE '%Oxigeno%'
    GROUP BY ten.enfermoID
    ORDER BY (SELECT COUNT(enfermoID) FROM TratamientoEnfermo WHERE enfermoID = ten.enfermoID 
    AND tratamientoID = (SELECT tratamientoID FROM Tratamiento WHERE nombre LIKE'%Oxigeno%')) DESC
    LIMIT 5
;
/*  ====== ======================== CONSULTA NO.6 ======================== ======*/
/*  Mostrar el nombre, el apellido y la fecha de fallecimiento de todas las
    víctimas que se movieron por la dirección “1987 Delphine Well” a los cuales
    se les aplicó "Manejo de la presión arterial" como tratamiento.
    Esa direccion solo existe para la ubiacion del hospital*/
CREATE VIEW view_consulta6
AS
    SELECT en.nombre AS Nombre, en.apellido AS Apellido, en.fechaMuerte AS Fecha_Muerte,
    h.direccion AS Direccion_hospital, t.nombre AS Tratamiento
    FROM Enfermo AS en
    INNER JOIN TratamientoEnfermo AS ten ON ten.enfermoID = en.enfermoID
    INNER JOIN HOSPITAL AS h ON h.hospitalID = ten.hospitalID
    INNER JOIN Tratamiento AS t ON t.tratamientoID = ten.tratamientoID
    WHERE en.fechaMuerte > '0000-00-00 00:00:00'
    AND t.nombre LIKE '%Manejo de la presion arterial%'
    AND h.direccion LIKE '%1987 Delphine Well%'
    GROUP BY h.direccion
;
/*  ====== ======================== CONSULTA NO.7 ======================== ======*/
/* Mostrar nombre, apellido y dirección de las víctimas que tienen menos de 2
    allegados los cuales hayan estado en un hospital y que se le hayan aplicado
    únicamente dos tratamientos. */
CREATE VIEW view_consulta7
AS
    SELECT en.nombre AS Nombre,en.apellido AS Apellido,en.direccion AS Direccion,
    (SELECT COUNT(asociadoID) FROM ContactoContagio WHERE enfermoID = cc.enfermoID) 'No_Asociados',
    (SELECT COUNT(enfermoID) FROM TratamientoEnfermo WHERE enfermoID = cc.enfermoID) 'No_tratamientos'
    FROM Enfermo AS en
    INNER JOIN ContactoContagio AS cc ON cc.enfermoID = en.enfermoID
    INNER JOIN TratamientoEnfermo AS ten ON  ten.enfermoID = cc.enfermoID
    WHERE (SELECT COUNT(enfermoID) FROM TratamientoEnfermo WHERE enfermoID = cc.enfermoID) <=> 2
    AND  (SELECT COUNT(asociadoID) FROM ContactoContagio WHERE enfermoID = cc.enfermoID) < 2
    GROUP BY cc.enfermoID
;
/*  ====== ======================== CONSULTA NO.8 ======================== ======*/
/*  Mostrar el número de mes ,de la fecha de la primera sospecha, nombre y
    apellido de las víctimas que más tratamientos se han aplicado y las que
    menos. (Todo en una sola consulta). */
CREATE VIEW view_consulta8
AS
    SELECT en.nombre AS Nombre, en.apellido AS Apellido,(MONTH(en.fechaSospecha)) 'Mes_Sospecha',
    (SELECT COUNT(enfermoID) FROM TratamientoEnfermo WHERE enfermoID = ten.enfermoID) 'No_tratamientos'
    FROM Enfermo AS en
    INNER JOIN TratamientoEnfermo AS ten ON ten.enfermoID = en.enfermoID
    GROUP BY ten.enfermoID
    ORDER BY (SELECT COUNT(enfermoID) FROM TratamientoEnfermo WHERE enfermoID = ten.enfermoID) DESC
;
/*  ====== ======================== CONSULTA NO.9 ======================== ======*/
/*  Mostrar el porcentaje de víctimas que le corresponden a cada hospital. */
CREATE VIEW view_consulta9
AS
    SELECT hp.nombre,(SELECT COUNT(enfermoID) FROM Hospitalizacion WHERE hospitalID = hz.hospitalID) 'Cantidad',
    (CONCAT(ROUND(
        ((SELECT COUNT(enfermoID) FROM Hospitalizacion WHERE hospitalID = hz.hospitalID)/(SELECT COUNT(enfermoID) FROM Hospitalizacion)) * 100,
        1),' %')) 'Porcentaje'
    FROM Hospital AS hp
    INNER JOIN Hospitalizacion AS hz ON hz.hospitalID = hp.hospitalID
    GROUP BY hz.hospitalID;
;
