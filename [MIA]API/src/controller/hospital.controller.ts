import { Request, Response } from "express";
import fs from "fs-extra";
import pool from "../database";
import { ITemp } from "../models/temp.model";

/* ================================== CARGA MASIVA ================================== */
/**
 * Metetodo encargado de leer la ruta para la carga masiva y ejecutar la carga masiva
 * @param req: Request de la peticion
 * @para res: Response de la peticio
 * @returns: Devuelve un json con el resultado de la peticion
 */
export const loadFiles = async (
  req: Request,
  res: Response
): Promise<Response> => {
  // enf -> shortcut para empresiones lambada
  const filePath: string = req.body.filePath;
  const data = await fs.readFile(filePath, "utf-8");
  let splitData: string[] = data.split("\r\n");

  splitData.forEach((value, index) => {
    if (index > 0) {
      const recordSplit:string[] = value.split(";");
      const newTemp: ITemp = {
        temporalID: 0,
        /* =========== DATOS DE ENFERMO =========== */
        nombre_victima:recordSplit[0],
        apellido_victima:recordSplit[1],
        direccion_victima:recordSplit[2],
        fecha_sospecha:recordSplit[3],
        fecha_confirmacion:recordSplit[4],
        fecha_muerte:recordSplit[5],
        estado_victima:recordSplit[6],
        /* =========== DATOS DEL ASOCIADO =========== */
        nombre_asociado:recordSplit[7],
        apellido_asociado:recordSplit[8],
        fecha_conocio:recordSplit[9],
        tipo_contacto:recordSplit[10],
        fecha_inicio_contacto:recordSplit[11],
        fecha_fin_contacto:recordSplit[12],
        /* =========== DATOS DEL HOSPITAL =========== */
        nombre_hospital:recordSplit[13],
        ubicacion_hospital:recordSplit[14],
        /* =========== DATOS DEL LUGAR CONTAGIO =========== */
        ubicacion_victima:recordSplit[15],
        fecha_llegada:recordSplit[16],
        fecha_retiro:recordSplit[17],
        /* =========== DATOS DEL TRATAMIENTO =========== */
        nombre_tratamiento:recordSplit[18],
        efectividad_tratamietno:recordSplit[19],
        fecha_incio_tratamiento:recordSplit[20],
        fecha_fin_tratamiento:recordSplit[21],
        efectividad_tratamiento_victima:recordSplit[22] != '\r' ? recordSplit[22]:''
      };
      console.log(newTemp);
    }
  });

  return res.status(200).json({ msg:'The file loaded successfully' });
};

/* ================================== GET DATOS ================================== */
/**
 * Metetodo encargado de devolver todos los datos de la consulta
 * @param req: Request de la peticion
 * @para res: Response de la peticio
 * @returns: Devuelve un json con el resultado de la peticion
 */
export const getDatos = (req: Request, res: Response) => {};
