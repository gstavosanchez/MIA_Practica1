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
  let index:number = 0;
  for (let value of splitData ) {
    if (index > 0 && value != '' && value != null) {
      const recordSplit:string[] = value.split(";");
      const newTemp: ITemp = {
        temporalID: index,
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
      const resutl = await pool.query('CALL sp_insert_temp (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)',[
        newTemp.nombre_victima,newTemp.apellido_victima,newTemp.direccion_victima,newTemp.fecha_sospecha,newTemp.fecha_confirmacion,newTemp.fecha_muerte,newTemp.estado_victima,
        newTemp.nombre_asociado,newTemp.apellido_asociado,newTemp.fecha_conocio,newTemp.tipo_contacto,newTemp.fecha_inicio_contacto,newTemp.fecha_fin_contacto,
        newTemp.nombre_hospital,newTemp.ubicacion_hospital,
        newTemp.ubicacion_victima,newTemp.fecha_llegada,newTemp.fecha_retiro,
        newTemp.nombre_tratamiento,newTemp.efectividad_tratamietno,newTemp.fecha_incio_tratamiento,newTemp.fecha_fin_tratamiento,newTemp.efectividad_tratamiento_victima
      ]);
    }
    index++;
  }

  return res.status(200).json({ msg:'The file loaded successfully' });
};

/* ================================== GET CONSULTA NO.1 ================================== */
/**
 * Metetodo encargado de devolver todos los datos de la consulta No.1
 * @param req: Request de la peticion
 * @param res: Response de la peticio
 * @returns: Devuelve un json con el resultado de la peticion
 */
export const getQuery1 = async (req: Request, res: Response):Promise<Response> => {
  const result:any[] = await pool.query('SELECT * FROM view_consulta1');
  if (result.length == 0) return res.status(404).json({msg: `There is't data in the query`})

  return res.status(200).json({ consulta1:result});
};

/* ================================== GET CONSULTA NO.2 ================================== */
/**
 * Metetodo encargado de devolver todos los datos de la consulta No.2
 * @param req: Request de la peticion
 * @para res: Response de la peticio
 * @returns: Devuelve un json con el resultado de la peticion
 */
export const getQuery2 = async (req:Request,res:Response):Promise<Response> => {
  const result:any[] = await pool.query('SELECT * FROM view_consulta2');
  if(result.length == 0) return res.status(404).json({msg:`There isn't data in the query`});
  
  return res.status(200).json({consulta2:result});
}
/* ================================== GET CONSULTA NO.3 ================================== */
/**
 * Metetodo encargado de devolver todos los datos de la consulta No.3
 * @param req: Request de la peticion
 * @param res: Response de la peticio
 * @returns: Devuelve un json con el resultado de la peticion
 */
export const getQuery3 = async (req:Request,res:Response):Promise<Response> => {
  const result:any[] = await pool.query('SELECT * FROM view_consulta3');
  if(result.length == 0) return res.status(404).json({msg:`The isn't data in the query`});
  return res.status(200).json({consulta3:result})
}
/* ================================== GET CONSULTA NO.4 ================================== */
/**
 * Metetodo encargado de devolver todos los datos de la consulta No.4
 * @param req: Request de la peticion
 * @param res: Response de la peticio
 * @returns: Devuelve un json con el resultado de la peticion
 */
export const getQuery4 = async(req:Request,res:Response):Promise<Response> => {
  const result:any[] = await pool.query('SELECT * FROM view_consulta4');
  if(result.length == 0) return res.status(404).json({msg:`The isn't data in the query`});
  return res.status(200).json({consulta3:result})
}
/* ================================== GET CONSULTA NO.5 ================================== */
/**
 * Metetodo encargado de devolver todos los datos de la consulta No.5
 * @param req: Request de la peticion
 * @param res: Response de la peticio
 * @returns: Devuelve un json con el resultado de la peticion
 */
export const getQuery5 = async (req:Request,res:Response):Promise<Response> => {
  const result:any[] = await pool.query('SELECT * FROM view_consulta5');
  if(result.length == 0) return res.status(404).json({msg:`The isn't data in the query`});
  return res.status(200).json({consulta3:result})
}
/* ================================== GET CONSULTA NO.6 ================================== */
/**
 * Metetodo encargado de devolver todos los datos de la consulta No.5
 * @param req: Request de la peticion
 * @param res: Response de la peticio
 * @returns: Devuelve un json con el resultado de la peticion
 */
export const getQuery6 = async (req:Request,res:Response):Promise<Response> => {
  const result:any[] = await pool.query('SELECT * FROM view_consulta6');
  if(result.length == 0) return res.status(404).json({msg:`The isn't data in the query`});
  return res.status(200).json({consulta3:result})
}
/* ================================== GET CONSULTA NO.7 ================================== */
/**
 * Metetodo encargado de devolver todos los datos de la consulta No.5
 * @param req: Request de la peticion
 * @param res: Response de la peticio
 * @returns: Devuelve un json con el resultado de la peticion
 */
 export const getQuery7 = async (req:Request,res:Response):Promise<Response> => {
  const result:any[] = await pool.query('SELECT * FROM view_consulta7');
  if(result.length == 0) return res.status(404).json({msg:`The isn't data in the query`});
  return res.status(200).json({consulta3:result})
}
/* ================================== GET CONSULTA NO.8 ================================== */
/**
 * Metetodo encargado de devolver todos los datos de la consulta No.5
 * @param req: Request de la peticion
 * @param res: Response de la peticio
 * @returns: Devuelve un json con el resultado de la peticion
 */
 export const getQuery8 = async (req:Request,res:Response):Promise<Response> => {
  const result:any[] = await pool.query('SELECT * FROM view_consulta8');
  if(result.length == 0) return res.status(404).json({msg:`The isn't data in the query`});
  return res.status(200).json({consulta3:result})
}
/* ================================== GET CONSULTA NO.9 ================================== */
/**
 * Metetodo encargado de devolver todos los datos de la consulta No.5
 * @param req: Request de la peticion
 * @param res: Response de la peticio
 * @returns: Devuelve un json con el resultado de la peticion
 */
 export const getQuery9 = async (req:Request,res:Response):Promise<Response> => {
  const result:any[] = await pool.query('SELECT * FROM view_consulta9');
  if(result.length == 0) return res.status(404).json({msg:`The isn't data in the query`});
  return res.status(200).json({consulta3:result})
}
/* ================================== GET CONSULTA NO.10 ================================== */
/**
 * Metetodo encargado de devolver todos los datos de la consulta No.5
 * @param req: Request de la peticion
 * @param res: Response de la peticio
 * @returns: Devuelve un json con el resultado de la peticion
 */
 export const getQuery10 = async (req:Request,res:Response):Promise<Response> => {
  const result:any[] = await pool.query('SELECT * FROM view_consulta10');
  if(result.length == 0) return res.status(404).json({msg:`The isn't data in the query`});
  return res.status(200).json({consulta3:result})
}